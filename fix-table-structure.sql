-- Fix paramiterindoor table structure
-- Add id column if it doesn't exist
ALTER TABLE `paramiterindoor` ADD COLUMN `id` INT AUTO_INCREMENT PRIMARY KEY FIRST;

-- Insert default data if table is empty
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