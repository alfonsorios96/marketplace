import { Transport, RmqOptions } from '@nestjs/microservices';

export const rabbitMQConfig = (): RmqOptions => ({
    transport: Transport.RMQ,
    options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'order_shipped_queue',
        queueOptions: {
            durable: true
        }
    }
});