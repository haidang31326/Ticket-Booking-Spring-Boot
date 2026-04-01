package com.dane.ticketbooking.Service;

import com.dane.ticketbooking.Entity.Customer;
import com.dane.ticketbooking.Entity.Event;
import com.dane.ticketbooking.Entity.Order;
import com.dane.ticketbooking.Exception.EventExceptionNotFound;
import com.dane.ticketbooking.Exception.NotEnoughCapacity;
import com.dane.ticketbooking.Exception.OrderExceptionNotFound;
import com.dane.ticketbooking.Repository.CustomerRepository;
import com.dane.ticketbooking.Repository.EventRepository;
import com.dane.ticketbooking.Repository.OrderRepository;
import com.dane.ticketbooking.Request.BookingRequest;
import com.dane.ticketbooking.Response.BookingReponse;
import com.dane.ticketbooking.Response.OrderReponse;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class BookingService {
    private final EventRepository eventRepository;
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final EventService eventService;


    public BookingService(EventRepository eventRepository,OrderRepository orderRepository,CustomerRepository customerRepository,EventService eventService) {
        this.eventRepository = eventRepository;
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.eventService = eventService;
    }

    public OrderReponse createOrder(BookingRequest  bookingRequest) {
        BookingReponse bookingResponse = bookEvent(bookingRequest);
        Event event = eventRepository.findById(bookingRequest.getEventId()).orElseThrow();
        if(event.getLeftCapacity()<bookingRequest.getTicketcount()){
            throw new NotEnoughCapacity("Not enough capacity for event with id " + event.getId());
        }
        eventService.updateLeftCapaCity(bookingResponse.getEventId(), bookingResponse.getTicketcount());
        Order order = Order.builder()
                .event(event)
                .customer(customerRepository.findById(bookingRequest.getUserId()).orElseThrow())
                .price(event.getPrice())
                .totalPrice(bookingResponse.getTotalPrice())
                .ticketCount(bookingRequest.getTicketcount())
                .placedAt(LocalDateTime.now())
                .build();

        orderRepository.save(order);

        return OrderReponse.builder()
                .bookingId(order.getOrderId())
                .customerId(order.getCustomer().getId())
                .eventId(order.getEvent().getId())
                .ticketCount(order.getTicketCount())
                .totalPrice(order.getTotalPrice())
                .bookingTime(LocalDateTime.now())
                .build();
    }





    public BookingReponse bookEvent(BookingRequest  bookingRequest) {
        Event event = eventRepository.findById(bookingRequest.getEventId()).orElseThrow(() -> new EventExceptionNotFound("Event with id " + bookingRequest.getEventId() + " not found"));
        Customer customerresponse = customerRepository.findById(bookingRequest.getUserId()).orElseThrow();

        return BookingReponse.builder()
                .EventId(event.getId())
                .UserId(customerresponse.getId())
                .userName(customerresponse.getName())
                .ticketcount(bookingRequest.getTicketcount())
                .totalPrice(event.getPrice().multiply(BigDecimal.valueOf(bookingRequest.getTicketcount())))
                .build();
    }

    public List<OrderReponse> getOrderById(Long orderId) {
        List<Order> orders = orderRepository.findByCustomerId(orderId);
        return orders.stream()
                .map(order -> OrderReponse.builder()
                        .bookingId(order.getOrderId())
                        .eventId(order.getEvent().getId())
                        .customerId(order.getCustomer().getId())
                        .ticketCount(order.getTicketCount())
                        .totalPrice(order.getTotalPrice())
                        .bookingTime(order.getPlacedAt())
                        .build())
                .toList();
    }

    public List<OrderReponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(order -> OrderReponse.builder()
                        .bookingId(order.getOrderId())
                        .eventId(order.getEvent().getId())
                        .customerId(order.getCustomer().getId())
                        .ticketCount(order.getTicketCount())
                        .totalPrice(order.getTotalPrice())
                        .bookingTime(order.getPlacedAt())
                        .build())
                .toList();
    }
}
