package com.dane.ticketbooking.Repository;

import com.dane.ticketbooking.Entity.Event;
import com.dane.ticketbooking.Response.EventReponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event,Long> {

}
