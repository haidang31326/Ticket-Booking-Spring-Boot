package com.dane.ticketbooking.Service;

import com.dane.ticketbooking.Entity.Venue;
import com.dane.ticketbooking.Repository.VenueRepository;
import com.dane.ticketbooking.Request.VenueRequest;
import com.dane.ticketbooking.Response.VenueReponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VenueService {
    private VenueRepository venueRepository;
    @Autowired
    public VenueService(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }



    public VenueReponse createVenue(VenueRequest venueRq) {
        Venue venue = Venue.builder()
                .name(venueRq.getVenueName())
                .address(venueRq.getVenueAddress())
                .totalCapacity(venueRq.getVenueCapacity())
                .build();

        venueRepository.save(venue);

        return VenueReponse.builder()
                .venueid(venue.getId())
                .address(venue.getAddress())
                .name(venue.getName())
                .totalCapacity(venue.getTotalCapacity())
                .build();
    }

    public VenueReponse getVenueById(Long venueid) {
        Venue venue = venueRepository.findById(venueid).orElseThrow(() -> new RuntimeException("Venue not found"));

        return VenueReponse.builder()
                .venueid(venue.getId())
                .name(venue.getName())
                .address(venue.getAddress())
                .totalCapacity(venue.getTotalCapacity())
                .build();
    }

    public List<VenueReponse> getVenueList() {
        List<Venue> venueList = venueRepository.findAll();

        return venueList.stream()
                .map(venue -> VenueReponse.builder()
                        .venueid(venue.getId())
                        .name(venue.getName())
                        .address(venue.getAddress())
                        .totalCapacity(venue.getTotalCapacity())
                        .build())
                .toList();
    }
}
