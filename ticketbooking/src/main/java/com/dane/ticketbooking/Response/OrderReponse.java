package com.dane.ticketbooking.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderReponse {
    private Long bookingId;
    private Long customerId;
    private Long eventId;
    private Long ticketCount;
    private BigDecimal totalPrice;
    private LocalDateTime bookingTime;
}
