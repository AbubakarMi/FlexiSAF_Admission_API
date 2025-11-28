-- Delete all sample payments created by DataLoader
-- This will leave only real payments made through the system
DELETE FROM payments WHERE transaction_id LIKE 'TXN-NGN-2025-%';

-- Verify what's left
SELECT COUNT(*) as remaining_payments FROM payments;
