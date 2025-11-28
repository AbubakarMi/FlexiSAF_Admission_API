package com.flexisaf.admissions.service;

import com.flexisaf.admissions.entity.Payment;
import com.flexisaf.admissions.exception.ResourceNotFoundException;
import com.flexisaf.admissions.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Transactional(readOnly = true)
    public Page<Payment> getAllPayments(Pageable pageable) {
        log.info("Fetching all payments with pagination");
        return paymentRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Payment getPaymentById(Long id) {
        log.info("Fetching payment with ID: {}", id);
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
    }

    @Transactional(readOnly = true)
    public List<Payment> getPaymentsByStudent(Long studentId) {
        log.info("Fetching payments for student ID: {}", studentId);
        return paymentRepository.findByStudentId(studentId);
    }

    @Transactional(readOnly = true)
    public List<Payment> getPaymentsByStatus(Payment.Status status) {
        log.info("Fetching payments with status: {}", status);
        return paymentRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPaymentStats() {
        log.info("Calculating payment statistics");

        List<Payment> allPayments = paymentRepository.findAll();
        List<Payment> completedPayments = paymentRepository.findByStatus(Payment.Status.COMPLETED);
        List<Payment> pendingPayments = paymentRepository.findByStatus(Payment.Status.PENDING);
        List<Payment> failedPayments = paymentRepository.findByStatus(Payment.Status.FAILED);

        BigDecimal totalRevenue = completedPayments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pendingAmount = pendingPayments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("pendingAmount", pendingAmount);
        stats.put("totalPayments", allPayments.size());
        stats.put("completedPayments", completedPayments.size());
        stats.put("pendingPayments", pendingPayments.size());
        stats.put("failedPayments", failedPayments.size());

        log.info("Payment stats calculated: {} total, {} completed, {} pending, {} failed",
                allPayments.size(), completedPayments.size(), pendingPayments.size(), failedPayments.size());

        return stats;
    }

    @Transactional
    public Payment createPayment(Payment payment) {
        log.info("Creating new payment for student: {}", payment.getStudentName());

        // Generate unique transaction ID if not provided
        if (payment.getTransactionId() == null || payment.getTransactionId().isEmpty()) {
            payment.setTransactionId(generateTransactionId());
        }

        Payment savedPayment = paymentRepository.save(payment);
        log.info("Successfully created payment with ID: {} and transaction ID: {}",
                savedPayment.getId(), savedPayment.getTransactionId());
        return savedPayment;
    }

    @Transactional
    public Payment updatePayment(Long id, Payment updatedPayment) {
        log.info("Updating payment with ID: {}", id);

        Payment existingPayment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));

        // Update fields
        existingPayment.setStudentName(updatedPayment.getStudentName());
        existingPayment.setProgram(updatedPayment.getProgram());
        existingPayment.setAmount(updatedPayment.getAmount());
        existingPayment.setPaymentType(updatedPayment.getPaymentType());
        existingPayment.setStatus(updatedPayment.getStatus());
        existingPayment.setSemester(updatedPayment.getSemester());
        existingPayment.setPaymentMethod(updatedPayment.getPaymentMethod());

        Payment saved = paymentRepository.save(existingPayment);
        log.info("Successfully updated payment with ID: {}", id);
        return saved;
    }

    @Transactional
    public Payment processPayment(Long id) {
        log.info("Processing payment with ID: {}", id);

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));

        if (payment.getStatus() == Payment.Status.COMPLETED) {
            throw new IllegalStateException("Payment is already completed");
        }

        payment.setStatus(Payment.Status.COMPLETED);
        payment.setPaymentDate(LocalDateTime.now());

        Payment saved = paymentRepository.save(payment);
        log.info("Successfully processed payment with ID: {}", id);
        return saved;
    }

    @Transactional
    public Payment refundPayment(Long id, String reason) {
        log.info("Refunding payment with ID: {} - Reason: {}", id, reason);

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));

        if (payment.getStatus() != Payment.Status.COMPLETED) {
            throw new IllegalStateException("Only completed payments can be refunded");
        }

        payment.setStatus(Payment.Status.REFUNDED);
        payment.setRefundedAt(LocalDateTime.now());
        payment.setRefundReason(reason);

        Payment saved = paymentRepository.save(payment);
        log.info("Successfully refunded payment with ID: {}", id);
        return saved;
    }

    @Transactional(readOnly = true)
    public Page<Payment> searchPayments(String query, Payment.Status status, String program, Pageable pageable) {
        log.info("Searching payments with query: {}, status: {}, program: {}", query, status, program);

        // For simplicity, we'll use findAll with pageable
        // In a real application, you would implement custom query methods or use Specifications
        Page<Payment> payments = paymentRepository.findAll(pageable);

        // Note: For production, implement proper search using JPA Specifications or custom queries
        log.info("Search returned {} payments", payments.getTotalElements());
        return payments;
    }

    private String generateTransactionId() {
        return "TXN-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
