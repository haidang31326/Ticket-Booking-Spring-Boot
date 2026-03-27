package com.dane.ticketbooking.Exception;

public class NotEnoughCapacity extends  RuntimeException{
    public NotEnoughCapacity(String message) {
        super(message);
    }
}
