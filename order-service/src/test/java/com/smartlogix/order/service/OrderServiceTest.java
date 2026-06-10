package com.smartlogix.order.service;

import com.smartlogix.order.domain.PurchaseOrder;
import com.smartlogix.order.repository.PurchaseOrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private PurchaseOrderRepository repository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void testDeleteOrder_Success() {
        // Preparar datos
        PurchaseOrder order = new PurchaseOrder();
        // (Eliminamos el setOrderNumber porque no hace falta para que el test pase)

        when(repository.findByOrderNumber("ORD-123")).thenReturn(Optional.of(order));

        // Ejecutar y Validar que no lance errores al borrar
        assertDoesNotThrow(() -> orderService.deleteOrder("ORD-123"));
        verify(repository, times(1)).delete(order);
    }
}