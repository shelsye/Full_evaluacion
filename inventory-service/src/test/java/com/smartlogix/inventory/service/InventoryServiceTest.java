package com.smartlogix.inventory.service;

import com.smartlogix.inventory.domain.InventoryItem;
import com.smartlogix.inventory.repository.InventoryItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InventoryServiceTest {

    @Mock
    private InventoryItemRepository repository;

    @InjectMocks
    private InventoryService inventoryService;

    @Test
    void testCheckAvailability_Success() {
        // Preparar datos simulados
        InventoryItem item = new InventoryItem();
        item.setSku("LAPTOP-X1");
        item.setAvailableQuantity(50);
        when(repository.findBySku("LAPTOP-X1")).thenReturn(Optional.of(item));

        // Ejecutar
        var result = inventoryService.checkAvailability("LAPTOP-X1", 10);

        // Validar
        assertTrue(result.available(), "Debería haber stock disponible");
        assertEquals("LAPTOP-X1", result.sku(), "El SKU debe coincidir");
    }

    @Test
    void testCheckAvailability_NotEnoughStock() {
        InventoryItem item = new InventoryItem();
        item.setSku("LAPTOP-X1");
        item.setAvailableQuantity(5); // Solo hay 5
        when(repository.findBySku("LAPTOP-X1")).thenReturn(Optional.of(item));

        // Piden 10 pero solo hay 5
        var result = inventoryService.checkAvailability("LAPTOP-X1", 10);

        assertFalse(result.available(), "No debería haber stock suficiente");
    }
}
