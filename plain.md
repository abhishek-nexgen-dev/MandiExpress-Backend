# 👤 User Authentication API

## 🧾 Description

This document provides details about the **Sign Up** and **Login** APIs for user authentication in the MandiExpress backend.  
The authentication system uses OTP (One-Time Password) for verification instead of a traditional password.

---

## 🚀 Endpoints

### 1. **Sign Up**

Registers a new user (**supplier**, **vendor**, **admin**, or **customer**) with all required details including location, phone, and role.  
An OTP is sent to the user's phone or email for verification.

#### Endpoint

`POST /api/v1/auth/SignUp`

---

### 📥 Request Body (JSON)

| Field          | Type   | Required | Description                                                                 |
|----------------|--------|----------|-----------------------------------------------------------------------------|
| `name`         | String | ✅ Yes   | Full name of the user                                                       |
| `email`        | String | ✅ Yes   | Unique, valid email address                                                 |
| `phone`        | String | ✅ Yes   | Unique 10-digit phone number                                                |
| `role`         | String | ✅ Yes   | One of: `supplier`, `vendor`, `admin`, `customer`                          |
| `location`     | Object | ❌ No    | GeoJSON object with type `"Point"` and coordinates `[longitude, latitude]` |
| `profileImage` | String | ❌ No    | URL of the profile picture (optional)                                      |

---

### Example Request

```json
{
  "name": "Ramesh Verma",
  "email": "ramesh@example.com",
  "phone": "9876543210",
  "role": "supplier",
  "location": {
    "type": "Point",
    "coordinates": [77.1234, 28.5678]
  },
  "profileImage": "https://example.com/images/ramesh.png"
}
```

---

### 📤 Response (JSON)

#### For Successful Sign Up

```json
{
  "status": "success",
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64c0f9f4e4b0a5d6c8f9e123",
      "name": "Ramesh Verma",
      "email": "ramesh@example.com",
      "phone": "9876543210",
      "role": "supplier",
      "isActive": true,
      "emailVerified": false,
      "phoneVerified": true,
      "profileImage": "https://example.com/images/ramesh.png",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### For Invalid OTP

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Invalid OTP"
}
```

---

### 2. **Login**

Authenticates an existing user using their phone or email and an OTP.  
If the OTP is valid, a JWT token is generated and returned.

#### Endpoint

`POST /api/v1/auth/Login`

---

### 📥 Request Body (JSON)

| Field      | Type   | Required | Description                     |
|------------|--------|----------|---------------------------------|
| `email`    | String | ✅ Yes   | Registered email address        |
| `otp`      | String | ✅ Yes   | One-Time Password sent to the user |

---

### Example Request

```json
{
  "email": "ramesh@example.com",
  "otp": "123456"
}
```



# 🛒 Product Management API

## 🧾 Description

This document provides details about the **Create Product** API for managing products in the MandiExpress backend, including support for auction-based bidding.  
If a product is already available, other vendors cannot create a duplicate product but can place bids on the existing product.

---

## 🚀 Endpoints

### 1. **Create Product**

Creates a new product for auction or direct sale.  
The product includes details like title, type, quantity, price, location, and more.  
For auction-based products, bidding functionality is supported.

#### Endpoint

`POST /api/v1/product/create`

---

### 📥 Request Body (JSON)

| Field          | Type   | Required | Description                                                                 |
|----------------|--------|----------|-----------------------------------------------------------------------------|
| `title`        | String | ✅ Yes   | Title of the product                                                       |
| `type`         | String | ✅ Yes   | One of: `auction`, `direct`                                                |
| `quantity`     | String | ✅ Yes   | Quantity of the product (e.g., "30 kg")                                    |
| `startPrice`   | Number | ✅ Yes   | Starting price for the product (must be ≥ 0)                               |
| `expiryTime`   | Date   | ✅ Yes   | Expiry time for the auction or sale                                        |
| `location`     | Object | ✅ Yes   | GeoJSON object with type `"Point"` and coordinates `[longitude, latitude]` |
| `status`       | String | ❌ No    | One of: `open`, `closed`, `expired` (default: `open`)                      |
| `image`        | String | ❌ No    | URL of the product image (optional)                                        |
| `description`  | String | ❌ No    | Description of the product (optional)                                      |
| `createdBy`    | String | ✅ Yes   | User ID of the creator (reference to the `User` model)                     |
| `supplierId`   | String | ✅ Yes   | User ID of the supplier who owns the product                               |

---

### 📥 Additional Fields for Auctions

| Field           | Type   | Required | Description                                                                 |
|-----------------|--------|----------|-----------------------------------------------------------------------------|
| `bids`          | Array  | ❌ No    | List of bids placed on the product. Each bid includes `bidderId`, `supplierId`, `amount`, and `bidTime`. |
| `highestBid`    | Number | ❌ No    | The highest bid amount for the product. Defaults to `startPrice`.           |
| `highestBidder` | String | ❌ No    | The user ID of the highest bidder.                                          |

---

### Example Request

```json
{
  "title": "Fresh Tomatoes",
  "type": "auction",
  "quantity": "30 kg",
  "startPrice": 100,
  "expiryTime": "2025-07-26T20:00:00Z",
  "location": {
    "type": "Point",
    "coordinates": [77.1234, 28.5678]
  },
  "status": "open",
  "image": "https://example.com/images/tomatoes.png",
  "description": "Fresh organic tomatoes available for auction.",
  "createdBy": "64c0f9f4e4b0a5d6c8f9e123",
  "supplierId": "64c0f9f4e4b0a5d6c8f9e123",
  "bids": [
    {
      "bidderId": "64c0f9f4e4b0a5d6c8f9e789",
      "supplierId": "64c0f9f4e4b0a5d6c8f9e123",
      "amount": 120,
      "bidTime": "2025-07-26T10:00:00Z"
    },
    {
      "bidderId": "64c0f9f4e4b0a5d6c8f9e456",
      "supplierId": "64c0f9f4e4b0a5d6c8f9e456",
      "amount": 150,
      "bidTime": "2025-07-26T11:00:00Z"
    }
  ],
  "highestBid": 150,
  "highestBidder": "64c0f9f4e4b0a5d6c8f9e456"
}
```


## 🛠️ Notes

- The `type` field determines whether the product is for auction or direct sale.
- If `type` is `auction`, ensure the `expiryTime` is set for bidding.
- The `bids` array stores all bids placed on the product.
- Each bid now includes the `supplierId` of the bidder.
- The `highestBid` and `highestBidder` fields are updated dynamically as new bids are placed.
- The `location` field uses GeoJSON format for storing geographical data.
- The `status` field defaults to `open` and can be updated to `closed` or `expired` based on business logic.
- If a product is already available, other vendors cannot create a duplicate product but can place bids on the existing product.
