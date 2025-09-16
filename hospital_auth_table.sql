-- হাসপাতাল অথেনটিকেশন টেবিল তৈরি করার SQL
CREATE TABLE IF NOT EXISTS `hospital_auth` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hospital_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `hospital_id` (`hospital_id`),
  CONSTRAINT `hospital_auth_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `saas_registraction_table` (`srt_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;