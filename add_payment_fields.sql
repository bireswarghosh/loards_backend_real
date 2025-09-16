ALTER TABLE appointment_booking_app_nursing_bookings 
ADD COLUMN transaction_id VARCHAR(100),
ADD COLUMN payment_method ENUM('cash', 'card', 'upi', 'net_banking', 'cheque') DEFAULT 'cash';