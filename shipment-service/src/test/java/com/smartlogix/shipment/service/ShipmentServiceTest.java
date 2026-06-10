package com.smartlogix.shipment.service;

import com.smartlogix.shipment.domain.Shipment;
import com.smartlogix.shipment.repository.ShipmentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ShipmentServiceTest {

    @Mock
    private ShipmentRepository repository;

    @InjectMocks
    private ShipmentService shipmentService;

    @Test
    void testDeleteShipment_Success() {
        // Preparar datos
        Shipment shipment = new Shipment();
        shipment.setTrackingCode("SLX-12345");

        when(repository.findByTrackingCode("SLX-12345")).thenReturn(Optional.of(shipment));

        // Ejecutar y Validar
        assertDoesNotThrow(() -> shipmentService.deleteShipment("SLX-12345"));
        verify(repository, times(1)).delete(shipment);
    }
}
