import { User } from '@auth/schemas/user.schema';
import { MailService } from '@core/utils/notification/mail.service';
import { DeviceDocument, DeviceMetric } from '@devices/schemas/device.schema';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class DevicesMqttService implements OnModuleDestroy {
  public mqttClients: Map<string, MqttClient> = new Map();

  constructor(
    private mailService: MailService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  connectToDevice(user: User, device: DeviceDocument): MqttClient {
    const deviceId = device._id.toString();
    const connectionUrl = device.connectionUrl;

    let client = this.mqttClients.get(deviceId);

    if (!client) {
      client = connect(connectionUrl);
      this.mqttClients.set(deviceId, client);

      client.on('connect', () => {
        this.logger.info(`Connected to MQTT broker for device ${deviceId}`, {
          context: 'MQTT',
        });
        client.subscribe('sensor/data', (err) => {
          if (err) {
            this.logger.error(`Failed to subscribe: ${err.message}`, {
              context: 'MQTT',
            });
          } else {
            this.logger.info(`Connected to MQTT at ${connectionUrl}`, {
              context: 'MQTT',
            });
          }
        });
      });

      client.on('message', (topic, message) => {
        const data = JSON.parse(message.toString());
        this.processDeviceData(user, device.metrics, data);
        this.logger.info(`Device ${deviceId} sent ${data}`, {
          context: 'MQTT',
        });
      });

      client.on('error', (err) => {
        this.logger.error(err.message, { context: 'MQTT' });
      });
    }

    return client;
  }

  processDeviceData(user: User, metrics: DeviceMetric[], data: any) {
    metrics.forEach((metric) => {
      const value = data[metric.metric];
      if (value < metric.min || value > metric.max) {
        this.sendAlertEmail(user, value, metric);
      }
    });
  }

  async sendAlertEmail(
    user: User,
    value: number,
    metric: DeviceMetric,
  ): Promise<void> {
    this.logger.warn(
      `Device exceeded limit: ${value} ${metric.unit}. Sending email to ${user.email}, `,
      { context: 'MQTT' },
    );
    const formattedDateTime = new Date().toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    this.mailService.sendMail({
      to: user.email,
      subject: 'Device Alert',
      text: `The ${metric.metric} is out of range. Current value: ${value} ${metric.unit}.\n\nThis event occurred at ${formattedDateTime}.\n\nPlease take appropriate action to resolve the issue.`,
    });
  }

  disconnectDevice(deviceId: string) {
    const client = this.mqttClients.get(deviceId);

    if (client) {
      client.end();
      this.mqttClients.delete(deviceId);
      this.logger.info(`Disconnected from MQTT broker for device ${deviceId}`, {
        context: 'MQTT',
      });
    } else {
      this.logger.warn(`No active MQTT connection for device ${deviceId}`, {
        context: 'MQTT',
      });
    }
  }

  onModuleDestroy() {
    this.mqttClients.forEach((client) => client.end());
  }
}
