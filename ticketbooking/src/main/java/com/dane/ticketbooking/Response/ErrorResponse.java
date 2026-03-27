package com.dane.ticketbooking.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class ErrorResponse   {
    private String message;
    private int status;

}
