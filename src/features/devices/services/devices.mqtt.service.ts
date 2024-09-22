import { DeviceDocument, DeviceMetric } from '@devices/schemas/device.schema';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { NotificationsService } from '@features/notifications/services/notifications.service';

@Injectable()
export class DevicesMqttService implements OnModuleDestroy {
  public mqttClients: Map<string, MqttClient> = new Map();

  constructor(
    private notificationsService: NotificationsService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  // provides only userId to prevent late update on email / fcm notification
  connectToDevice(userId: string, device: DeviceDocument): MqttClient {
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
        this.processDeviceData(
          userId,
          device._id.toString(),
          device.name,
          device.metrics,
          data,
        );
        this.logger.info(`Device ${deviceId} sent ${JSON.stringify(data)}`, {
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
    userId: string,
    deviceId: string,
    deviceName: string,
    metrics: DeviceMetric[],
    data: any,
  ) {
    metrics.forEach((metric) => {
      const value = data[metric.metric];
      if (value < metric.min || value > metric.max) {
        this.notificationsService.sendNotification(
          userId,
          deviceId,
          deviceName,
          value,
          metric,
        );
      }
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
