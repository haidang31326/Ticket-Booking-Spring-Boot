package com.dane.ticketbooking.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "event")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name")
    private String name;
    @Column(name = "capacity")
    private Long capacity;
    @Column(name = "left_capacity")
    private Long leftCapacity;

    @Column(name = "ticket_price")
    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "venue_id")
    private Venue venue;


}
