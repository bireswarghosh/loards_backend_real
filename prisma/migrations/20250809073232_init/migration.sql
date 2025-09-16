-- CreateTable
CREATE TABLE `package` (
    `PackageId` INTEGER NOT NULL,
    `Package` VARCHAR(255) NULL,
    `DescId` INTEGER NULL,
    `Rate` DOUBLE NULL,
    `GSTAmt` DOUBLE NULL,

    PRIMARY KEY (`PackageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `packinclude` (
    `IncludeId` INTEGER NOT NULL,
    `PackageId` INTEGER NOT NULL,
    `IncHead` VARCHAR(50) NULL,
    `IncHeadRate` DOUBLE NULL,

    PRIMARY KEY (`IncludeId`, `PackageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paramiterindoor` (
    `DoctotVisitInBill` VARCHAR(1) NOT NULL DEFAULT 'Y',
    `DoctotVisitInEst` VARCHAR(1) NULL,
    `AddServiceMed` VARCHAR(1) NULL,
    `ServiceMedPer` DOUBLE NULL,
    `AddServiceDiag` VARCHAR(1) NULL,
    `ServiceDiagPer` DOUBLE NULL,
    `ChkOutTime` VARCHAR(10) NULL,
    `FixedServiceBed` DOUBLE NULL,
    `MedBillShow` VARCHAR(1) NULL,
    `AddServiceOT` VARCHAR(1) NULL,
    `StartDt` DATETIME(3) NULL,
    `CopSCH` DOUBLE NULL,
    `EditTime` CHAR(1) NULL,
    `MedAdd` CHAR(1) NULL,
    `AddSrvDr` CHAR(1) NULL,
    `CM` CHAR(1) NULL,
    `COMM` VARCHAR(1) NULL,
    `RecColl` VARCHAR(1) NULL,
    `FBYN` VARCHAR(1) NULL,
    `SMoneyYN` VARCHAR(1) NULL,
    `AdmChkTime` VARCHAR(1) NULL,
    `GChkTime` VARCHAR(20) NULL,
    `MedP` DOUBLE NULL,
    `DagP` DOUBLE NULL,
    `AdmTime` VARCHAR(20) NULL,
    `DIRA` VARCHAR(1) NULL,
    `DIRF` VARCHAR(1) NULL,
    `DuplicateMR` VARCHAR(1) NULL,
    `Nirnoy` VARCHAR(1) NULL,
    `DIROP` VARCHAR(1) NULL,
    `OTDtlYN` VARCHAR(1) NULL,
    `dcareeditYN` VARCHAR(1) NULL,
    `otherchargeheadingyn` VARCHAR(1) NULL,
    `tpaotherchargeyn` VARCHAR(1) NULL,
    `backdateentryyn` VARCHAR(1) NULL,
    `fbillc` VARCHAR(1) NULL,
    `bedcal` VARCHAR(1) NULL,
    `admineditamtchange` VARCHAR(1) NULL,
    `MedAdv` VARCHAR(1) NULL,
    `DisFinalBill` VARCHAR(1) NULL,
    `MRD` VARCHAR(1) NULL,
    `fbillprint` VARCHAR(1) NULL,
    `pbedcal` VARCHAR(1) NULL,
    `PtntNameYN` VARCHAR(1) NULL,
    `sdatewisebed` VARCHAR(1) NULL,
    `IndrDBName` VARCHAR(100) NULL,
    `monthwiseadmno` VARCHAR(1) NULL,
    `NoRec` VARCHAR(1) NULL,
    `MaxCashRec` DOUBLE NULL,
    `RefundRecYN` VARCHAR(1) NULL,
    `GSTP` DOUBLE NULL,
    `HealthCardP` DOUBLE NULL,

    PRIMARY KEY (`DoctotVisitInBill`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `depgroup` (
    `DepGroupId` INTEGER NOT NULL,
    `DepGroup` VARCHAR(50) NULL,
    `Anst` DOUBLE NULL,
    `Assi` DOUBLE NULL,
    `Sour` DOUBLE NULL,

    PRIMARY KEY (`DepGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departmentindoor` (
    `DepartmentId` INTEGER NOT NULL,
    `Department` VARCHAR(50) NULL,
    `DepGroupId` INTEGER NULL,
    `MinAdv` DOUBLE NULL,
    `MaxBalance` DOUBLE NULL,
    `Referal` DOUBLE NULL,
    `PSL` INTEGER NULL,
    `RateType` INTEGER NULL,

    PRIMARY KEY (`DepartmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bedmaster` (
    `BedId` INTEGER NOT NULL AUTO_INCREMENT,
    `Bed` VARCHAR(20) NULL,
    `DepartmentId` INTEGER NULL,
    `BedCh` DOUBLE NULL,
    `AtttndantCh` DOUBLE NULL,
    `TotalCh` DOUBLE NULL,
    `ServiceCh` VARCHAR(1) NULL,
    `ShowInFinal` VARCHAR(1) NULL,
    `Vacant` VARCHAR(1) NULL,
    `ShortName` VARCHAR(10) NULL,
    `RMOCh` DOUBLE NULL,
    `BP` DOUBLE NULL,
    `RateEdit` INTEGER NULL,
    `GST` INTEGER NULL,

    PRIMARY KEY (`BedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daycare` (
    `DayCareId` INTEGER NOT NULL AUTO_INCREMENT,
    `DayCare` VARCHAR(200) NULL,
    `Rate` DOUBLE NULL,

    PRIMARY KEY (`DayCareId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otmaster` (
    `OtMasterId` INTEGER NOT NULL AUTO_INCREMENT,
    `OtMaster` VARCHAR(50) NULL,
    `Rate` DOUBLE NULL,

    PRIMARY KEY (`OtMasterId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otslot` (
    `OTSlotId` INTEGER NOT NULL AUTO_INCREMENT,
    `OtMasterId` INTEGER NULL,
    `OTSlot` VARCHAR(50) NULL,
    `Rate` DOUBLE NULL,
    `DepGroupId` INTEGER NULL,

    PRIMARY KEY (`OTSlotId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ottype` (
    `OtTypeId` INTEGER NOT NULL AUTO_INCREMENT,
    `OtType` VARCHAR(50) NULL,

    PRIMARY KEY (`OtTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otcategory` (
    `OtCategoryId` INTEGER NOT NULL AUTO_INCREMENT,
    `OtCategory` VARCHAR(50) NULL,

    PRIMARY KEY (`OtCategoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otitem` (
    `OtItemId` INTEGER NOT NULL AUTO_INCREMENT,
    `OtItem` VARCHAR(50) NULL,
    `OtCategoryId` INTEGER NULL,
    `Rate` DOUBLE NULL,
    `Unit` VARCHAR(20) NULL,
    `ServiceChYN` CHAR(1) NULL,

    PRIMARY KEY (`OtItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `achead` (
    `ACHeadId` INTEGER NOT NULL AUTO_INCREMENT,
    `ACHead` VARCHAR(40) NULL,
    `System` VARCHAR(1) NULL,

    PRIMARY KEY (`ACHeadId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `acgroup` (
    `ACGroupId` INTEGER NOT NULL AUTO_INCREMENT,
    `ACGroup` VARCHAR(40) NULL,
    `ACHeadId` INTEGER NULL,
    `System` VARCHAR(1) NULL,

    PRIMARY KEY (`ACGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `acsubgrp` (
    `AcSubGrpId` INTEGER NOT NULL AUTO_INCREMENT,
    `SubGrp` VARCHAR(50) NULL,
    `AcGroupId` INTEGER NULL,
    `system` VARCHAR(1) NULL,
    `LgrLike` CHAR(1) NULL,

    PRIMARY KEY (`AcSubGrpId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `acgenled` (
    `DescId` INTEGER NOT NULL AUTO_INCREMENT,
    `Desc` VARCHAR(100) NULL,
    `ShortName` VARCHAR(20) NULL,
    `OpTYpe` VARCHAR(1) NULL,
    `OpBalance` DOUBLE NULL,
    `AcType` VARCHAR(1) NULL,
    `Address1` VARCHAR(40) NULL,
    `Address2` VARCHAR(40) NULL,
    `Address3` VARCHAR(40) NULL,
    `Phone` VARCHAR(50) NULL,
    `ItPaNo` VARCHAR(40) NULL,
    `CSTNo` VARCHAR(40) NULL,
    `LSTNo` VARCHAR(40) NULL,
    `TDS` DOUBLE NULL,
    `System` VARCHAR(1) NULL,
    `LDATE` DATETIME(3) NULL,
    `IntId` VARCHAR(10) NULL,
    `PartyType` VARCHAR(1) NULL,
    `EMail` VARCHAR(50) NULL,
    `AcSubGrpId` INTEGER NULL,
    `EntType` CHAR(1) NULL,
    `BillFormatId` INTEGER NULL,
    `VCode` VARCHAR(10) NULL,
    `SCode` VARCHAR(10) NULL,
    `IGST` INTEGER NULL,

    PRIMARY KEY (`DescId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cashless` (
    `CashlessId` INTEGER NOT NULL AUTO_INCREMENT,
    `Cashless` VARCHAR(50) NULL,
    `Add1` VARCHAR(50) NULL,
    `Add2` VARCHAR(50) NULL,
    `Phone` VARCHAR(25) NULL,
    `Company` INTEGER NULL,
    `Add3` VARCHAR(50) NULL,
    `emailid` VARCHAR(50) NULL,
    `contactperson` VARCHAR(50) NULL,
    `cPhone` VARCHAR(25) NULL,
    `servicecharge` VARCHAR(1) NULL,
    `AcGenLedCompany` INTEGER NULL,

    PRIMARY KEY (`CashlessId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment_booking_app_patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `mobileNo` VARCHAR(15) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `appointment_booking_app_patient_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment_booking_app_health_packages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `packageName` VARCHAR(255) NOT NULL,
    `packagePrice` DECIMAL(10, 2) NOT NULL,
    `packageDescription` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment_booking_app_package_services` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `packageId` INTEGER NOT NULL,
    `serviceName` VARCHAR(255) NOT NULL,
    `serviceDescription` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment_booking_app_package_purchases` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` INTEGER NOT NULL,
    `packageId` INTEGER NOT NULL,
    `purchaseAmount` DECIMAL(10, 2) NOT NULL,
    `paymentStatus` ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    `paymentMethod` VARCHAR(50) NULL,
    `transactionId` VARCHAR(255) NULL,
    `purchaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `packinclude` ADD CONSTRAINT `packinclude_PackageId_fkey` FOREIGN KEY (`PackageId`) REFERENCES `package`(`PackageId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bedmaster` ADD CONSTRAINT `bedmaster_DepartmentId_fkey` FOREIGN KEY (`DepartmentId`) REFERENCES `departmentindoor`(`DepartmentId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `otslot` ADD CONSTRAINT `otslot_OtMasterId_fkey` FOREIGN KEY (`OtMasterId`) REFERENCES `otmaster`(`OtMasterId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `otslot` ADD CONSTRAINT `otslot_DepGroupId_fkey` FOREIGN KEY (`DepGroupId`) REFERENCES `depgroup`(`DepGroupId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `otitem` ADD CONSTRAINT `otitem_OtCategoryId_fkey` FOREIGN KEY (`OtCategoryId`) REFERENCES `otcategory`(`OtCategoryId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `acgroup` ADD CONSTRAINT `acgroup_ACHeadId_fkey` FOREIGN KEY (`ACHeadId`) REFERENCES `achead`(`ACHeadId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `acsubgrp` ADD CONSTRAINT `acsubgrp_AcGroupId_fkey` FOREIGN KEY (`AcGroupId`) REFERENCES `acgroup`(`ACGroupId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `acgenled` ADD CONSTRAINT `acgenled_AcSubGrpId_fkey` FOREIGN KEY (`AcSubGrpId`) REFERENCES `acsubgrp`(`AcSubGrpId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cashless` ADD CONSTRAINT `cashless_AcGenLedCompany_fkey` FOREIGN KEY (`AcGenLedCompany`) REFERENCES `acgenled`(`DescId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment_booking_app_package_services` ADD CONSTRAINT `appointment_booking_app_package_services_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `appointment_booking_app_health_packages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment_booking_app_package_purchases` ADD CONSTRAINT `appointment_booking_app_package_purchases_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `appointment_booking_app_patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment_booking_app_package_purchases` ADD CONSTRAINT `appointment_booking_app_package_purchases_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `appointment_booking_app_health_packages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
