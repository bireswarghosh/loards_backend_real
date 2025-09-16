# জেনেরিক মেডিসিন API ডকুমেন্টেশন

## Overview
এই API জেনেরিক মেডিসিনের জন্য সম্পূর্ণ CRUD অপারেশন প্রদান করে। এতে রয়েছে:
- ✅ CREATE (তৈরি করা)
- ✅ READ (পড়া) - সব ডেটা, আইডি দিয়ে, অনুসন্ধান
- ✅ UPDATE (আপডেট করা)
- ✅ DELETE (মুছে ফেলা)
- ✅ Pagination (পেজিনেশন)
- ✅ Search Dictionary (অনুসন্ধান অভিধান)

## Base URL
```
http://localhost:5000/api/v1
```

## Endpoints

### 1. CREATE - নতুন জেনেরিক মেডিসিন তৈরি করা

**POST** `/generic-medicines`

**Request Body:**
```json
{
  "name": "Napa",
  "genericName": "Paracetamol",
  "manufacturer": "Beximco Pharmaceuticals",
  "strength": "500mg",
  "dosageForm": "Tablet",
  "price": 2.50,
  "description": "Pain reliever and fever reducer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "জেনেরিক মেডিসিন সফলভাবে তৈরি হয়েছে",
  "data": {
    "id": 1,
    "name": "Napa",
    "generic_name": "Paracetamol",
    "manufacturer": "Beximco Pharmaceuticals",
    "strength": "500mg",
    "dosage_form": "Tablet",
    "price": 2.50,
    "description": "Pain reliever and fever reducer",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. READ - সব জেনেরিক মেডিসিন পেজিনেশন সহ

**GET** `/generic-medicines?page=1&limit=10&search=napa`

**Query Parameters:**
- `page` (optional): পেজ নম্বর (default: 1)
- `limit` (optional): প্রতি পেজে আইটেম (5-100, default: 10)
- `search` (optional): অনুসন্ধানের জন্য

**Response:**
```json
{
  "success": true,
  "message": "জেনেরিক মেডিসিনের তালিকা",
  "data": [
    {
      "id": 1,
      "name": "Napa",
      "generic_name": "Paracetamol",
      "manufacturer": "Beximco Pharmaceuticals",
      "strength": "500mg",
      "dosage_form": "Tablet",
      "price": 2.50,
      "description": "Pain reliever and fever reducer",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 45,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 3. READ - আইডি দিয়ে নির্দিষ্ট মেডিসিন

**GET** `/generic-medicines/:id`

**Response:**
```json
{
  "success": true,
  "message": "জেনেরিক মেডিসিনের বিস্তারিত",
  "data": {
    "id": 1,
    "name": "Napa",
    "generic_name": "Paracetamol",
    "manufacturer": "Beximco Pharmaceuticals",
    "strength": "500mg",
    "dosage_form": "Tablet",
    "price": 2.50,
    "description": "Pain reliever and fever reducer",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. SEARCH - অভিধানের মতো অনুসন্ধান

**GET** `/generic-medicines/search?query=paracetamol&page=1&limit=20`

**Query Parameters:**
- `query` (required): অনুসন্ধানের শব্দ
- `page` (optional): পেজ নম্বর (default: 1)
- `limit` (optional): প্রতি পেজে আইটেম (5-100, default: 10)

**Response:**
```json
{
  "success": true,
  "message": "\"paracetamol\" এর জন্য অনুসন্ধানের ফলাফল",
  "data": [
    {
      "id": 1,
      "name": "Napa",
      "generic_name": "Paracetamol",
      "manufacturer": "Beximco Pharmaceuticals",
      "strength": "500mg",
      "dosage_form": "Tablet",
      "price": 2.50,
      "description": "Pain reliever and fever reducer",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "searchQuery": "paracetamol",
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 5. UPDATE - মেডিসিন আপডেট করা

**PUT** `/generic-medicines/:id`

**Request Body:**
```json
{
  "name": "Napa Extra",
  "genericName": "Paracetamol",
  "manufacturer": "Beximco Pharmaceuticals",
  "strength": "665mg",
  "dosageForm": "Tablet",
  "price": 3.00,
  "description": "Enhanced pain reliever and fever reducer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "জেনেরিক মেডিসিন সফলভাবে আপডেট হয়েছে",
  "data": {
    "id": 1,
    "name": "Napa Extra",
    "generic_name": "Paracetamol",
    "manufacturer": "Beximco Pharmaceuticals",
    "strength": "665mg",
    "dosage_form": "Tablet",
    "price": 3.00,
    "description": "Enhanced pain reliever and fever reducer",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T11:45:00.000Z"
  }
}
```

### 6. DELETE - মেডিসিন মুছে ফেলা

**DELETE** `/generic-medicines/:id`

**Response:**
```json
{
  "success": true,
  "message": "জেনেরিক মেডিসিন সফলভাবে মুছে ফেলা হয়েছে"
}
```

## Error Responses

### 404 - Not Found
```json
{
  "success": false,
  "message": "জেনেরিক মেডিসিন পাওয়া যায়নি"
}
```

### 400 - Bad Request
```json
{
  "success": false,
  "message": "অনুসন্ধানের জন্য কিছু লিখুন"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "জেনেরিক মেডিসিন তৈরি করতে ত্রুটি",
  "error": "Database connection failed"
}
```

## Features

### 🔍 Advanced Search
- নাম, জেনেরিক নাম, প্রস্তুতকারক, শক্তি, এবং ডোজ ফর্ম দিয়ে অনুসন্ধান
- অগ্রাধিকার ভিত্তিক ফলাফল (exact match প্রথমে)
- Full-text search support

### 📄 Pagination
- Minimum 5 items per page
- Maximum 100 items per page
- Default 10 items per page
- Complete pagination info with hasNext/hasPrev

### 🎯 Dictionary-like Search
- Smart search ranking
- Multiple field search
- Case-insensitive search
- Partial match support

## Database Schema

```sql
CREATE TABLE generic_medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    strength VARCHAR(100),
    dosage_form VARCHAR(100),
    price DECIMAL(10,2) DEFAULT 0.00,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Setup Instructions

1. Run the SQL file to create the table:
```bash
mysql -u root -p your_database < create_generic_medicines_table.sql
```

2. The API routes are automatically included in the main app.js

3. Test the endpoints using Postman or any API client

## Sample Data Included
- 10 common Bangladeshi generic medicines
- Various manufacturers (Square, Beximco, Renata, Incepta)
- Different dosage forms (Tablet, Capsule)
- Realistic pricing in BDT