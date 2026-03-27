package com.dane.ticketbooking.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueRequest {
    private String venueName;
    private String venueAddress;
    private Long venueCapacity;


}
