import { Transport, RmqOptions } from '@nestjs/microservices';

export const getRabbitMQConfig = (url: string, queue: string): RmqOptions => ({
    transport: Transport.RMQ,
    options: {
        urls: [url],
        queue: queue,
        queueOptions: {
            durable: true
        },
        socketOptions: {
            heartbeatIntervalInSeconds: 60,
            reconnectTimeInSeconds: 5,
        },
    }
});