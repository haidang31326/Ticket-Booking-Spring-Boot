package com.dane.ticketbooking.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingReponse {
    private Long UserId;
    private String userName;
    private Long EventId;
    private Long ticketcount;
    private BigDecimal totalPrice;
}
