package com.dane.ticketbooking.Controller;

import com.dane.ticketbooking.Entity.Customer;
import com.dane.ticketbooking.Request.CustomerRequest;
import com.dane.ticketbooking.Response.CustomerReponse;
import com.dane.ticketbooking.Service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }


    @PostMapping("/customer/create")
    public ResponseEntity<CustomerReponse> createCustomer(@RequestBody CustomerRequest customer) {
        return ResponseEntity.ok(customerService.createUser(customer));
    }

    @PostMapping("/customer/login")
    public ResponseEntity<CustomerReponse> loginCustomer(@RequestBody CustomerRequest customer) {
        return ResponseEntity.ok(customerService.loginUser(customer.getEmail(), customer.getPassword()));
    }

}
