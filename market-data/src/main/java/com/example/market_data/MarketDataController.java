package com.example.market_data;

import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "*")
public class MarketDataController {

    private final Map<String, Double> basePrices = new HashMap<>();
    private final Map<String, Double> currentPrices = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public MarketDataController() {
        // Initialize some base prices
        basePrices.put("AAPL", 150.0);
        basePrices.put("MSFT", 300.0);
        basePrices.put("GOOGL", 2800.0);
        basePrices.put("AMZN", 3300.0);
        basePrices.put("TSLA", 700.0);
        basePrices.put("DIS", 110.0);
        basePrices.put("RELIANCE.NS", 2500.0);
        basePrices.put("TCS.NS", 3500.0);
        
        // Initialize current prices with base prices
        basePrices.forEach(currentPrices::put);
    }

    @GetMapping("/price/{ticker}")
    public Map<String, Object> getPrice(@PathVariable String ticker) {
        double basePrice = basePrices.getOrDefault(ticker.toUpperCase(), 100.0);
        double currentPrice = currentPrices.getOrDefault(ticker.toUpperCase(), basePrice);
        
        // Simulate a small fluctuation (-0.5% to +0.5%)
        double fluctuation = (random.nextDouble() - 0.5) * 0.01 * currentPrice;
        double newPrice = currentPrice + fluctuation;
        
        // Keep it somewhat near base price
        if (newPrice > basePrice * 1.2) newPrice -= Math.abs(fluctuation);
        if (newPrice < basePrice * 0.8) newPrice += Math.abs(fluctuation);
        
        currentPrices.put(ticker.toUpperCase(), newPrice);

        Map<String, Object> response = new HashMap<>();
        response.put("ticker", ticker.toUpperCase());
        response.put("price", Math.round(newPrice * 100.0) / 100.0);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @GetMapping("/history/{ticker}")
    public List<Map<String, Object>> getHistory(@PathVariable String ticker) {
        double basePrice = basePrices.getOrDefault(ticker.toUpperCase(), 100.0);
        List<Map<String, Object>> history = new ArrayList<>();
        long now = System.currentTimeMillis();
        
        for (int i = 14; i >= 0; i--) {
            Map<String, Object> point = new HashMap<>();
            double price = basePrice + (random.nextDouble() - 0.5) * 0.05 * basePrice;
            point.put("ticker", ticker.toUpperCase());
            point.put("price", Math.round(price * 100.0) / 100.0);
            point.put("timestamp", now - (i * 2000));
            history.add(point);
        }
        return history;
    }
}
