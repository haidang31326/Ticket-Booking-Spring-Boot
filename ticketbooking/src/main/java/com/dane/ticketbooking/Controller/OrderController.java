package com.dane.ticketbooking.Controller;

import com.dane.ticketbooking.Entity.Order;
import com.dane.ticketbooking.Repository.OrderRepository;
import com.dane.ticketbooking.Request.BookingRequest;
import com.dane.ticketbooking.Response.OrderReponse;
import com.dane.ticketbooking.Service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class OrderController {
    private final BookingService bookingService;

    public OrderController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/order/create")
    public ResponseEntity<OrderReponse> createOrder(@RequestBody BookingRequest order) {
        return ResponseEntity.ok(bookingService.createOrder(order));
    }

    @GetMapping("/order/{orderid}")
    public ResponseEntity<OrderReponse> getOrder(@PathVariable("orderid") Long orderid) {
        return ResponseEntity.ok(bookingService.getOrderById(orderid));
    }
    @GetMapping("/orders")
    public ResponseEntity<List<OrderReponse>> getAllOrders() {
        return ResponseEntity.ok(bookingService.getAllOrders());
    }
}
