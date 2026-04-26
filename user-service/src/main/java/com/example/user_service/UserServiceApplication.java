package com.example.user_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class UserServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}

	@Bean
	CommandLineRunner init(OrderRepository orderRepository) {
		return args -> {
			int updatedCount = orderRepository.updateLegacyOrders("system_legacy");
			System.out.println("========== LEGACY DATA SANITIZATION ==========");
			System.out.println("Updated " + updatedCount + " legacy orders to 'system_legacy'");
			System.out.println("==============================================");
		};
	}
}
