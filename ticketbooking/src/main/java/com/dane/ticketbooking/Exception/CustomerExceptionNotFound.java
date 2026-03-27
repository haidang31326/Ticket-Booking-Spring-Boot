package com.dane.ticketbooking.Exception;

public class CustomerExceptionNotFound extends RuntimeException{
    public CustomerExceptionNotFound(String message) {
        super(message);
    }
}
