package com.dane.ticketbooking.Response;

import com.dane.ticketbooking.Entity.Venue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventReponse {
    private Long EventId;
    private String name;
    private Long leftcapacity;
    private Long capacity;
    private BigDecimal price;
    private Venue venue;
}
