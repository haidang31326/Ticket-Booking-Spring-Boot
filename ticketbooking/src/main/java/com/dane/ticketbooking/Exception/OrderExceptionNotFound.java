package com.dane.ticketbooking.Exception;

public class OrderExceptionNotFound extends RuntimeException {
    public OrderExceptionNotFound(String message) {
        super(message);
    }
}
