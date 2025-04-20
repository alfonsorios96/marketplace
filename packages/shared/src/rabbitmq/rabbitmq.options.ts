import { Transport, RmqOptions } from '@nestjs/microservices';

export const getRabbitMQConfig = (url: string, queue: string): RmqOptions => ({
    transport: Transport.RMQ,
    options: {
        urls: [url],
        queue: queue,
        queueOptions: { durable: false },
        exchange: 'orders_exchange',
        noAck: false,
        routingKey: 'order.shipped'
    }
});