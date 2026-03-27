package com.dane.ticketbooking.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerReponse {
    private Long CustomerId;
    private String name;
    private String email;
    private String address;
}
