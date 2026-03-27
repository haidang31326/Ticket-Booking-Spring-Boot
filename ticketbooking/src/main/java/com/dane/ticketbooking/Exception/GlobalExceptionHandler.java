package com.dane.ticketbooking.Exception;

import com.dane.ticketbooking.Response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EventExceptionNotFound.class)
    public ResponseEntity<ErrorResponse> eventNotFound(EventExceptionNotFound e) {
        ErrorResponse err = new ErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND.value()
        );
        return new ResponseEntity<>(err, HttpStatus.NOT_FOUND);

    }
    @ExceptionHandler(OrderExceptionNotFound.class)
    public ResponseEntity<ErrorResponse> orderNotFound(OrderExceptionNotFound e) {
        ErrorResponse er = new ErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND.value());

        return new ResponseEntity<>(er, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(NotEnoughCapacity.class)
    public ResponseEntity<ErrorResponse> notEnoughCapacity(NotEnoughCapacity e) {
        ErrorResponse er = new ErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(er, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CustomerExceptionNotFound.class)
    public ResponseEntity<ErrorResponse> customerNotFound(CustomerExceptionNotFound ex) {
        ErrorResponse er = new ErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND.value());

        return new ResponseEntity<>(er, HttpStatus.NOT_FOUND);
    }
}
