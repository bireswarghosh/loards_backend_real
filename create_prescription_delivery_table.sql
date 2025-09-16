CREATE TABLE IF NOT EXISTS appointment_booking_app_prescription_delivery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  prescription_image VARCHAR(255),
  delivery_type ENUM('home_delivery', 'hospital_pickup') DEFAULT 'home_delivery',
  home_delivery_location VARCHAR(255),
  home_delivery_address TEXT,
  status ENUM('pending', 'confirmed', 'delivered', 'cancelled') DEFAULT 'pending',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES appointment_booking_app_patient(id) ON DELETE CASCADE
);