export class OrderCreatedEvent {
    constructor(order_id, product_id, quantity) {
        this.order_id = order_id;
        this.product_id = product_id;
        this.quantity = quantity;
    }
}
export class OrderShippedEvent {
    constructor(order_id, shipping_date) {
        this.order_id = order_id;
        this.shipping_date = shipping_date;
    }
}
