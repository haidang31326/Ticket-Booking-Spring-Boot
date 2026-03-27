package com.dane.ticketbooking.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueReponse {
    private Long venueid;
    private String name;
    private String address;
    private Long totalCapacity;
}
