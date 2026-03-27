package com.dane.ticketbooking.Repository;

import com.dane.ticketbooking.Entity.Customer;
import com.dane.ticketbooking.Response.CustomerReponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Long> {
    Optional<Customer> findByEmailAndPassword(String email, String password);
}
