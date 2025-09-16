ALTER TABLE appointment_booking_app_appointments 
ADD COLUMN payment_method ENUM('cash', 'card', 'upi', 'net_banking', 'cheque') DEFAULT 'cash',
ADD COLUMN transaction_id VARCHAR(100),
ADD COLUMN booking_price DECIMAL(10,2) DEFAULT 0;