package com.flexisaf.admissions.repository;

import com.flexisaf.admissions.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByStudentId(Long studentId);

    List<Payment> findByStatus(Payment.Status status);

    List<Payment> findByPaymentDateBetween(LocalDateTime start, LocalDateTime end);

    List<Payment> findByProgram(String program);

    Optional<Payment> findByTransactionId(String transactionId);
}
