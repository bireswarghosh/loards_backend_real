-- Create package tables manually

CREATE TABLE IF NOT EXISTS `appointment_booking_app_health_packages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packageName` varchar(255) NOT NULL,
  `packagePrice` decimal(10,2) NOT NULL,
  `packageDescription` text,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `appointment_booking_app_package_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packageId` int NOT NULL,
  `serviceName` varchar(255) NOT NULL,
  `serviceDescription` text,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `appointment_booking_app_package_services_packageId_fkey` (`packageId`),
  CONSTRAINT `appointment_booking_app_package_services_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `appointment_booking_app_health_packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `appointment_booking_app_package_purchases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patientId` int NOT NULL,
  `packageId` int NOT NULL,
  `purchaseAmount` decimal(10,2) NOT NULL,
  `paymentStatus` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  `paymentMethod` varchar(50) DEFAULT NULL,
  `transactionId` varchar(255) DEFAULT NULL,
  `purchaseDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `appointment_booking_app_package_purchases_patientId_fkey` (`patientId`),
  KEY `appointment_booking_app_package_purchases_packageId_fkey` (`packageId`),
  CONSTRAINT `appointment_booking_app_package_purchases_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `appointment_booking_app_patient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `appointment_booking_app_package_purchases_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `appointment_booking_app_health_packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert sample data
INSERT INTO `appointment_booking_app_health_packages` (`packageName`, `packagePrice`, `packageDescription`) VALUES
('Routine Body Checkup Package', 1600.00, 'Complete routine health checkup at cheapest rate'),
('Gastro Package', 2000.00, 'Comprehensive gastroenterology package with endoscopy option'),
('Senior Citizen Package', 2500.00, 'Specialized health package designed for senior citizens');

-- Insert sample services
INSERT INTO `appointment_booking_app_package_services` (`packageId`, `serviceName`) VALUES
(1, 'CBC'), (1, 'Sugar F'), (1, 'Urea'), (1, 'Creatinine'), (1, 'Uric Acid'), (1, 'L.F.T.'), (1, 'Lipid Profile'), (1, 'TSH'), (1, 'Sodium'), (1, 'Potassium'), (1, 'Urine RE'), (1, 'E.C.G.'), (1, 'Chest X-ray'), (1, 'MD Medicine'), (1, 'Dr. Consult'), (1, 'Free Health Check up'),
(2, 'Urea'), (2, 'Creatinine'), (2, 'CBC'), (2, 'Sugar Fasting'), (2, 'Sugar PP'), (2, 'P - Time'), (2, 'L.F.T.'), (2, 'W/A U.S.G.'), (2, 'Lipid Profile'), (2, 'Md. Medicine Consult'), (2, 'Endoscopy (Optional)'),
(3, 'CBC'), (3, 'Sugar F'), (3, 'Sugar PP'), (3, 'Urea'), (3, 'Creatinine'), (3, 'Uric Acid'), (3, 'Sodium'), (3, 'Potassium'), (3, 'Chloride'), (3, 'Lipid Profile'), (3, 'Urine RE'), (3, 'Stool RE'), (3, 'P.S.A.'), (3, 'Chest X-Ray'), (3, 'E.C.G.'), (3, '2D Echo Cardiography'), (3, 'A.S.D.'), (3, 'MD General Medicine');