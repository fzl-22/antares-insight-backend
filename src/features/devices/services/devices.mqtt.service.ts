import { User } from '@auth/schemas/user.schema';
import { FirebaseNotificationService } from '@core/utils/notification/firebase-notification.service';
import { MailNotificationService } from '@core/utils/notification/mail-notification.service';
import { DeviceDocument, DeviceMetric } from '@devices/schemas/device.schema';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class DevicesMqttService implements OnModuleDestroy {
  public mqttClients: Map<string, MqttClient> = new Map();

  constructor(
    private mailService: MailNotificationService,
    private fcmService: FirebaseNotificationService,
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
        this.processDeviceData(user, device.name, device.metrics, data);
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

  processDeviceData(
    user: User,
    deviceName: string,
    metrics: DeviceMetric[],
    data: any,
  ) {
    metrics.forEach((metric) => {
      const value = data[metric.metric];
      if (value < metric.min || value > metric.max) {
        this.sendNotification(user, deviceName, value, metric);
      }
    });
  }

  async sendNotification(
    user: User,
    deviceName: string,
    value: number,
    metric: DeviceMetric,
  ): Promise<void> {
    this.logger.warn(
      `Device exceeded limit: ${value} ${metric.unit}. Sending email to ${user.email}, `,
      { context: 'MQTT' },
    );
    const formattedDateTime = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    const title = 'Device Alert';
    const message = `The ${deviceName}'s ${metric.metric} is out of range. Current value: ${value} ${metric.unit}.\n\nThis event occurred at ${formattedDateTime}.\n\nPlease take appropriate action to resolve the issue.`;

    if (user.fcmToken) {
      this.fcmService.sendPushNotification({
        fcmToken: user.fcmToken,
        title: title,
        body: message,
      });
    }

    this.mailService.sendMail({
      to: user.email,
      subject: title,
      text: message,
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
