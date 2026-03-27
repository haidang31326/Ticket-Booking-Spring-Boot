package com.dane.ticketbooking.Service;

import com.dane.ticketbooking.Entity.Event;
import com.dane.ticketbooking.Exception.EventExceptionNotFound;
import com.dane.ticketbooking.Exception.NotEnoughCapacity;
import com.dane.ticketbooking.Repository.EventRepository;
import com.dane.ticketbooking.Repository.VenueRepository;
import com.dane.ticketbooking.Request.EventRequest;
import com.dane.ticketbooking.Response.EventReponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    public EventService(EventRepository eventRepository, VenueRepository venueRepository) {
        this.eventRepository = eventRepository;
        this.venueRepository = venueRepository;
    }


    public void updateLeftCapaCity(Long eventid, Long ticketcount) {
        Event e = eventRepository.findById(eventid).orElseThrow(() -> new EventExceptionNotFound("event with "  + eventid + " not found"));
        e.setLeftCapacity(e.getLeftCapacity() - ticketcount);
        eventRepository.save(e);
    }

    public EventReponse createEvent(EventRequest eventRequest) {
        Event e = Event.builder()
                .name(eventRequest.getEventName())
                .price(eventRequest.getPrice())
                .capacity(eventRequest.getCapacity())
                .leftCapacity(eventRequest.getCapacity())
                .venue(venueRepository.findById(eventRequest.getVenueId()).orElseThrow(() -> new RuntimeException("Venue not found")))
                .build();

        eventRepository.save(e);

        return EventReponse.builder()
                .EventId(e.getId())
                .name(e.getName())
                .venue(e.getVenue())
                .leftcapacity(e.getLeftCapacity())
                .capacity(e.getCapacity())
                .price(e.getPrice())
                .build();
    }

    public EventReponse getEventById(Long eventid) {
        Event e = eventRepository.findById(eventid).orElseThrow(() -> new EventExceptionNotFound("event with "  + eventid + " not found"));

        return EventReponse.builder()
                .EventId(e.getId())
                .name(e.getName())
                .price(e.getPrice())
                .capacity(e.getCapacity())
                .leftcapacity(e.getLeftCapacity())
                .venue(e.getVenue())
                .build();
    }

    public List<EventReponse> getEventList() {
        List<Event> eventList = eventRepository.findAll();

        return eventList.stream()
                .map(e -> EventReponse.builder()
                        .EventId(e.getId())
                        .name(e.getName())
                        .price(e.getPrice())
                        .capacity(e.getCapacity())
                        .leftcapacity(e.getLeftCapacity())
                        .venue(e.getVenue())
                        .build())
                .toList();
    }



}
