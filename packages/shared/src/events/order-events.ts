export class OrderCreatedEvent {
    constructor(
        public readonly order_id: string,
        public readonly product_id: string,
        public readonly quantity: number
    ) {}
}

export class OrderShippedEvent {
    constructor(
        public readonly order_id: string,
        public readonly shipping_date: Date
    ) {}
}
