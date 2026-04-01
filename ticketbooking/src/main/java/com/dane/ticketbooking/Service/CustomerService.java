package com.dane.ticketbooking.Service;

import com.dane.ticketbooking.Entity.Customer;
import com.dane.ticketbooking.Exception.CustomerExceptionNotFound;
import com.dane.ticketbooking.Repository.CustomerRepository;
import com.dane.ticketbooking.Request.CustomerRequest;
import com.dane.ticketbooking.Response.CustomerReponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {
    private CustomerRepository customerRepository;
    @Autowired
    public CustomerService(CustomerRepository  customerRepository) {
        this.customerRepository = customerRepository;
    }


    public CustomerReponse createUser(CustomerRequest customer) {
        if(customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            throw new CustomerExceptionNotFound("Customer with email " + customer.getEmail() + " already exists");
        }
        Customer newCustomer = Customer.builder()
                .name(customer.getName())
                .email(customer.getEmail())
                .password(customer.getPassword())
                .address(customer.getAddress())
                .build();

        customerRepository.save(newCustomer);


        return   CustomerReponse.builder()
                .CustomerId(newCustomer.getId())
                .email(newCustomer.getEmail())
                .name(newCustomer.getName())
                .address(newCustomer.getAddress())
                .build();
    }

    public CustomerReponse loginUser(String  email, String password) {
        Customer customer = customerRepository.findByEmailAndPassword(email,password).orElseThrow(()-> new CustomerExceptionNotFound("Customer not found with email: " + email));
        return   CustomerReponse.builder()
                .CustomerId(customer.getId())
                .email(customer.getEmail())
                .name(customer.getName())
                .address(customer.getAddress())
                .build();
    }

}
