package com.dane.ticketbooking.Controller;

import com.dane.ticketbooking.Request.EventRequest;
import com.dane.ticketbooking.Response.EventReponse;
import com.dane.ticketbooking.Service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class EventController {
    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping("/event/create")
    public ResponseEntity<EventReponse> createEvent(@RequestBody EventRequest eventRequest) {

        return ResponseEntity.ok(eventService.createEvent(eventRequest));
    }

    @GetMapping("/event/{eventid}")
    public ResponseEntity<EventReponse> getEvent(@PathVariable Long eventid) {
        return ResponseEntity.ok(eventService.getEventById(eventid));
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventReponse>> getEvents() {
        return ResponseEntity.ok(eventService.getEventList());
    }
}
