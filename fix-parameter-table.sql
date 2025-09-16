-- Fix Indoor Parameter Setup Table and Insert Default Data

-- First, check if the table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS `paramiterindoor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `DoctotVisitInBill` varchar(1) DEFAULT NULL,
  `DoctotVisitInEst` varchar(1) DEFAULT NULL,
  `AddServiceMed` varchar(1) DEFAULT NULL,
  `ServiceMedPer` double DEFAULT NULL,
  `AddServiceDiag` varchar(1) DEFAULT NULL,
  `ServiceDiagPer` double DEFAULT NULL,
  `ChkOutTime` varchar(10) DEFAULT NULL,
  `FixedServiceBed` double DEFAULT NULL,
  `MedBillShow` varchar(1) DEFAULT NULL,
  `AddServiceOT` varchar(1) DEFAULT NULL,
  `StartDt` datetime DEFAULT NULL,
  `CopSCH` double DEFAULT NULL,
  `EditTime` char(1) DEFAULT NULL,
  `MedAdd` char(1) DEFAULT NULL,
  `AddSrvDr` char(1) DEFAULT NULL,
  `CM` char(1) DEFAULT NULL,
  `COMM` varchar(1) DEFAULT NULL,
  `RecColl` varchar(1) DEFAULT NULL,
  `FBYN` varchar(1) DEFAULT NULL,
  `SMoneyYN` varchar(1) DEFAULT NULL,
  `AdmChkTime` varchar(1) DEFAULT NULL,
  `GChkTime` varchar(20) DEFAULT NULL,
  `MedP` double DEFAULT NULL,
  `DagP` double DEFAULT NULL,
  `AdmTime` varchar(20) DEFAULT NULL,
  `DIRA` varchar(1) DEFAULT NULL,
  `DIRF` varchar(1) DEFAULT NULL,
  `DuplicateMR` varchar(1) DEFAULT NULL,
  `Nirnoy` varchar(1) DEFAULT NULL,
  `DIROP` varchar(1) DEFAULT NULL,
  `OTDtlYN` varchar(1) DEFAULT NULL,
  `dcareeditYN` varchar(1) DEFAULT NULL,
  `otherchargeheadingyn` varchar(1) DEFAULT NULL,
  `tpaotherchargeyn` varchar(1) DEFAULT NULL,
  `backdateentryyn` varchar(1) DEFAULT NULL,
  `fbillc` varchar(1) DEFAULT NULL,
  `bedcal` varchar(1) DEFAULT NULL,
  `admineditamtchange` varchar(1) DEFAULT NULL,
  `MedAdv` varchar(1) DEFAULT NULL,
  `DisFinalBill` varchar(1) DEFAULT NULL,
  `MRD` varchar(1) DEFAULT NULL,
  `fbillprint` varchar(1) DEFAULT NULL,
  `pbedcal` varchar(1) DEFAULT NULL,
  `PtntNameYN` varchar(1) DEFAULT NULL,
  `sdatewisebed` varchar(1) DEFAULT NULL,
  `IndrDBName` varchar(100) DEFAULT NULL,
  `monthwiseadmno` varchar(1) DEFAULT NULL,
  `NoRec` varchar(1) DEFAULT NULL,
  `MaxCashRec` double DEFAULT NULL,
  `RefundRecYN` varchar(1) DEFAULT NULL,
  `GSTP` double DEFAULT NULL,
  `HealthCardP` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert default data if no records exist
INSERT INTO `paramiterindoor` (
  `DoctotVisitInBill`, `DoctotVisitInEst`, `AddServiceMed`, `ServiceMedPer`, 
  `AddServiceDiag`, `ServiceDiagPer`, `ChkOutTime`, `FixedServiceBed`, 
  `MedBillShow`, `AddServiceOT`, `StartDt`, `CopSCH`, `EditTime`, `MedAdd`, 
  `AddSrvDr`, `CM`, `COMM`, `RecColl`, `FBYN`, `SMoneyYN`, `AdmChkTime`, 
  `GChkTime`, `MedP`, `DagP`, `AdmTime`, `DIRA`, `DIRF`, `DuplicateMR`, 
  `Nirnoy`, `DIROP`, `OTDtlYN`, `dcareeditYN`, `otherchargeheadingyn`, 
  `tpaotherchargeyn`, `backdateentryyn`, `fbillc`, `bedcal`, `admineditamtchange`, 
  `MedAdv`, `DisFinalBill`, `MRD`, `fbillprint`, `pbedcal`, `PtntNameYN`, 
  `sdatewisebed`, `IndrDBName`, `monthwiseadmno`, `NoRec`, `MaxCashRec`, 
  `RefundRecYN`, `GSTP`, `HealthCardP`
) 
SELECT 
  'Y', 'Y', 'Y', 115, 'Y', 115, '1 PM', 0, 'Y', 'Y', 
  '2016-04-01 00:00:00', 20, 'Y', 'Y', 'Y', 'Y', 'N', 'Y', 'Y', 'Y', 'Y', 
  '12:00 PM', 2, 101, '1:00 PM', 'N', 'N', 'N', 'N', 'N', 'Y', 'N', 'N', 
  'N', 'Y', 'Y', 'Y', 'N', 'N', 'Y', 'N', 'Y', 'Y', 'Y', 'Y', 
  'HOSPITAL_DBhh', 'Y', 'N', 841460, 'Y', 18, 5
WHERE NOT EXISTS (SELECT 1 FROM `paramiterindoor` LIMIT 1);

-- Show the current data
SELECT * FROM `paramiterindoor`;