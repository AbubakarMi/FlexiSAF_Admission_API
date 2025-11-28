package com.flexisaf.admissions.controller;

import com.flexisaf.admissions.entity.Payment;
import com.flexisaf.admissions.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment management endpoints")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all payments", description = "Retrieve paginated list of payments with optional filters")
    public ResponseEntity<Page<Payment>> getAllPayments(
            @Parameter(description = "Filter by status")
            @RequestParam(required = false) Payment.Status status,

            @Parameter(description = "Filter by program")
            @RequestParam(required = false) String program,

            @Parameter(description = "Search query")
            @RequestParam(required = false) String query,

            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size,

            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "createdAt") String sort,

            @Parameter(description = "Sort direction (asc/desc)")
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ?
                Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<Payment> payments;
        if (query != null || status != null || program != null) {
            payments = paymentService.searchPayments(query, status, program, pageable);
        } else {
            payments = paymentService.getAllPayments(pageable);
        }

        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get payment by ID", description = "Retrieve a specific payment by its ID")
    public ResponseEntity<Payment> getPaymentById(
            @Parameter(description = "Payment ID") @PathVariable Long id) {
        Payment payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/student/{studentId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get student payments", description = "Retrieve all payments for a specific student")
    public ResponseEntity<List<Payment>> getPaymentsByStudent(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        List<Payment> payments = paymentService.getPaymentsByStudent(studentId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/stats")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get payment statistics", description = "Retrieve payment statistics including revenue, counts, etc.")
    public ResponseEntity<Map<String, Object>> getPaymentStats() {
        Map<String, Object> stats = paymentService.getPaymentStats();
        return ResponseEntity.ok(stats);
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create payment", description = "Create a new payment record")
    public ResponseEntity<Payment> createPayment(@Valid @RequestBody Payment payment) {
        Payment createdPayment = paymentService.createPayment(payment);
        return new ResponseEntity<>(createdPayment, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update payment", description = "Update an existing payment")
    public ResponseEntity<Payment> updatePayment(
            @Parameter(description = "Payment ID") @PathVariable Long id,
            @Valid @RequestBody Payment payment) {
        Payment updatedPayment = paymentService.updatePayment(id, payment);
        return ResponseEntity.ok(updatedPayment);
    }

    @PostMapping("/{id}/process")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Process payment", description = "Mark a payment as completed/processed")
    public ResponseEntity<Payment> processPayment(
            @Parameter(description = "Payment ID") @PathVariable Long id) {
        Payment processedPayment = paymentService.processPayment(id);
        return ResponseEntity.ok(processedPayment);
    }

    @PostMapping("/{id}/refund")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Refund payment", description = "Refund a completed payment with a reason")
    public ResponseEntity<Payment> refundPayment(
            @Parameter(description = "Payment ID") @PathVariable Long id,
            @Parameter(description = "Refund reason") @RequestBody Map<String, String> body) {
        String reason = body.get("reason");
        if (reason == null || reason.isEmpty()) {
            throw new IllegalArgumentException("Refund reason is required");
        }
        Payment refundedPayment = paymentService.refundPayment(id, reason);
        return ResponseEntity.ok(refundedPayment);
    }
}
