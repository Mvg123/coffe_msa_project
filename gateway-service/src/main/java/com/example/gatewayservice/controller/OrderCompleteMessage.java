package com.example.gatewayservice.controller;

class OrderCompleteMessage {
    private Long orderId;
    private String productName;
    private Integer quantity;
    private String customerName;
    private String orderDate;

    // Getters and Setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }

    @Override
    public String toString() {
        return "OrderCompleteMessage{" +
                "orderId=" + orderId +
                ", productName='" + productName + '\'' +
                ", quantity=" + quantity +
                ", customerName='" + customerName + '\'' +
                ", orderDate='" + orderDate + '\'' +
                '}';
    }
}
