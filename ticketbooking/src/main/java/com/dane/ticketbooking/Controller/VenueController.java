package com.dane.ticketbooking.Controller;

import com.dane.ticketbooking.Request.VenueRequest;
import com.dane.ticketbooking.Response.VenueReponse;
import com.dane.ticketbooking.Service.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class VenueController {
    private VenueService    venueService;

    @Autowired
    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @PostMapping("/venue/create")
    public ResponseEntity<VenueReponse> createVenue(@RequestBody VenueRequest venueRequest) {
        return ResponseEntity.ok(venueService.createVenue(venueRequest));
    }

    @GetMapping("/venue/{venueid}")
    public ResponseEntity<VenueReponse> getVenue(@PathVariable Long venueid) {
        return ResponseEntity.ok(venueService.getVenueById(venueid));
    }

    @GetMapping("/venues")
    public ResponseEntity<List<VenueReponse>> getVenues() {
        return ResponseEntity.ok(venueService.getVenueList());
    }
}
