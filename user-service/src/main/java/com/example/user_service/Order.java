package com.example.user_service;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ticker;
    private Integer quantity;
    private Double price;
    private String type; // BUY or SELL
    private String username;
    private LocalDateTime timestamp;

    public Order() {}

    public Order(String ticker, Integer quantity, Double price, String type, String username) {
        this.ticker = ticker;
        this.quantity = quantity;
        this.price = price;
        this.type = type;
        this.username = username;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTicker() { return ticker; }
    public void setTicker(String ticker) { this.ticker = ticker; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
