package com.dane.ticketbooking.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRequest {
    private Long eventId;
    private String eventName;
    private Long venueId;
    private Long capacity;
    private Long leftcapacity;
    private BigDecimal price;
}
