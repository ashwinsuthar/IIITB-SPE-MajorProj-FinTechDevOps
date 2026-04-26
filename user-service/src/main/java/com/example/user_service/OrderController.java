package com.example.user_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/orders")
    public List<Order> getAllOrders(@RequestParam(required = false) String username) {
        if (username != null && !username.isEmpty()) {
            return orderRepository.findByUsername(username);
        }
        return orderRepository.findAll();
    }

    @PostMapping("/orders")
    public Order placeOrder(@RequestBody Order order) {
        if (order.getType() == null) order.setType("BUY");
        if (order.getTimestamp() == null) order.setTimestamp(java.time.LocalDateTime.now());
        return orderRepository.save(order);
    }

    @GetMapping("/portfolio")
    public Map<String, Object> getPortfolioSummary(@RequestParam(required = false) String username) {
        List<Order> orders;
        if (username != null && !username.isEmpty()) {
            orders = orderRepository.findByUsername(username);
        } else {
            orders = orderRepository.findAll();
        }
        
        double initialBalance = 15000.0;
        double currentBalance = initialBalance;

        for (Order order : orders) {
            double total = (order.getPrice() != null ? order.getPrice() : 100.0) * (order.getQuantity() != null ? order.getQuantity() : 10);
            if ("BUY".equalsIgnoreCase(order.getType())) {
                currentBalance -= total;
            } else {
                currentBalance += total;
            }
        }

        return Map.of(
            "balance", currentBalance,
            "orderCount", orders.size(),
            "status", "Healthy",
            "username", username != null ? username : "ALL"
        );
    }
}
