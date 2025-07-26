# 👤 User Authentication API

## 🧾 Description

This document provides details about the **Sign Up** and **Login** APIs for user authentication in the MandiExpress backend.

---

## 🚀 Endpoints

### 1. **Sign Up**

Registers a new user (**supplier**, **vendor**, **admin**, or **customer**) with all required details including location, phone, and role.  
The password is securely hashed using **argon2** before being saved to the database.

#### Endpoint

`POST /v1/auth/SignUp`

---

### 📥 Request Body (JSON)

| Field          | Type   | Required | Description                                                                 |
|----------------|--------|----------|-----------------------------------------------------------------------------|
| `name`         | String | ✅ Yes   | Full name of the user                                                       |
| `email`        | String | ✅ Yes   | Unique, valid email address                                                 |
| `phone`        | String | ✅ Yes   | Unique 10-digit phone number                                                |
| `password`     | String | ✅ Yes   | Password (minimum 6 characters, will be hashed using **argon2**)           |
| `role`         | String | ✅ Yes   | One of: `supplier`, `vendor`, `admin`, `customer`                          |
| `location`     | Object | ✅ No    | GeoJSON object with type `"Point"` and coordinates `[longitude, latitude]` |
| `profileImage` | String | ❌ No    | URL of the profile picture (optional)                                      |

---

### Example Request

```json
{
  "name": "Ramesh Verma",
  "email": "ramesh@example.com",
  "phone": "9876543210",
  "password": "SecurePass123",
  "role": "supplier",
  "location": {
    "type": "Point",
    "coordinates": [77.1234, 28.5678]
  },
  "profileImage": "https://example.com/images/ramesh.png"
}
```

---

### 2. **Login**

Authenticates an existing user using their email and password.  
If the credentials are valid, a JWT token is generated and returned.

#### Endpoint

`POST /v1/auth/Login`

---

### 📥 Request Body (JSON)

| Field      | Type   | Required | Description                     |
|------------|--------|----------|---------------------------------|
| `email`    | String | ✅ Yes   | Registered email address        |
| `password` | String | ✅ Yes   | Password associated with email  |

---

### Example Request

```json
{
  "email": "ramesh@example.com",
  "password": "SecurePass123"
}
```

---

### 📤 Response (JSON)

#### For Successful Login

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "64c0f9f4e4b0a5d6c8f9e123",
      "name": "Ramesh Verma",
      "email": "ramesh@example.com",
      "phone": "9876543210",
      "role": "supplier",
      "isActive": true,
      "emailVerified": false,
      "phoneVerified": false,
      "profileImage": "https://example.com/images/ramesh.png",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```
