package com.example.user_service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUsername(String username);

    @Transactional
    @Modifying
    @Query("UPDATE Order o SET o.username = :defaultUser WHERE o.username IS NULL")
    int updateLegacyOrders(@Param("defaultUser") String defaultUser);
}
