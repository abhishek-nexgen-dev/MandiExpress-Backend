# 📘 MandiExpress Backend API Documentation

This document provides details about the APIs for **User Authentication**, **Product Management**, and **Category Management** in the MandiExpress backend.

---

## 👤 User Authentication API

### 🧾 Description

The authentication system uses OTP (One-Time Password) for verification instead of a traditional password.  
Users can sign up, log in, and validate OTPs for authentication.

---

### 🚀 Endpoints

#### 1. **Sign Up**

Registers a new user (**supplier**, **vendor**, **admin**, or **customer**) with all required details including location, phone, and role.  
An OTP is sent to the user's phone or email for verification.

**Endpoint**: `POST /api/v1/auth/SignUp`

---

#### 📥 Request Body (JSON)

| Field          | Type   | Required | Description                                                                 |
|----------------|--------|----------|-----------------------------------------------------------------------------|
| `name`         | String | ✅ Yes   | Full name of the user                                                       |
| `email`        | String | ✅ Yes   | Unique, valid email address                                                 |
| `phone`        | String | ✅ Yes   | Unique 10-digit phone number                                                |
| `role`         | String | ✅ Yes   | One of: `supplier`, `vendor`, `admin`, `customer`                          |
| `profileImage` | String | ❌ No    | URL of the profile picture (optional)                                      |

---

#### 📤 Response (JSON)

**For Successful Sign Up**:

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

---

#### 2. **Send OTP for Login**

Generates and sends an OTP to the user's registered email for login.

**Endpoint**: `POST /api/v1/auth/send-login-otp`

---

#### 📥 Request Body (JSON)

| Field   | Type   | Required | Description                     |
|---------|--------|----------|---------------------------------|
| `email` | String | ✅ Yes   | Registered email address        |

---

#### 📤 Response (JSON)

**For Successful OTP Generation**:

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "OTP sent successfully.",
  "data": {
    "email": "ramesh@example.com"
  }
}
```

---

#### 3. **Validate OTP and Login**

Validates the OTP sent to the user's email and logs the user in if the OTP is valid. A JWT token is generated and returned.

**Endpoint**: `POST /api/v1/auth/validate-login-otp`

---

#### 📥 Request Body (JSON)

| Field   | Type   | Required | Description                     |
|---------|--------|----------|---------------------------------|
| `email` | String | ✅ Yes   | Registered email address        |
| `otp`   | String | ✅ Yes   | One-Time Password sent to the user |

---

#### 📤 Response (JSON)

**For Successful Login**:

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "User login successful.",
  "data": {
    "user": {
      "_id": "64c0f9f4e4b0a5d6c8f9e123",
      "name": "Ramesh Verma",
      "email": "ramesh@example.com",
      "role": "supplier",
      "isActive": true,
      "emailVerified": true,
      "profileImage": "https://example.com/images/ramesh.png",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

## 🛒 Product Management API

### 🧾 Description

This document provides details about the **Create Product** API for managing products in the MandiExpress backend, including support for auction-based bidding.

---

### 🚀 Endpoints

#### 1. **Create Product**

Creates a new product for auction or direct sale.  
The product includes details like title, type, quantity, price, location, and more.

**Endpoint**: `POST /api/v1/vendor/product/create`

---

#### 📥 Request Body (JSON)

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

---

#### 📤 Response (JSON)

**For Successful Product Creation**:

```json
{
  "status": "success",
  "statusCode": 201,
  "message": "Product created successfully.",
  "data": {
    "productId": "64c0f9f4e4b0a5d6c8f9e123",
    "title": "Fresh Tomatoes"
  }
}
```

---

## 📂 Category Management API

### 🧾 Description

This document provides details about the **Category Management** APIs for vendors in the MandiExpress backend.  
Vendors can create, update, and delete categories to organize their products.

---

### 🚀 Endpoints

#### 1. **Create Category**

Allows a vendor to create a new category.

**Endpoint**: `POST /api/v1/category/create`

---

#### 📥 Request Body (JSON)

| Field         | Type   | Required | Description                                                                 |
|---------------|--------|----------|-----------------------------------------------------------------------------|
| `name`        | String | ✅ Yes   | Name of the category                                                       |
| `description` | String | ❌ No    | Description of the category (optional)                                     |
| `image`       | String | ❌ No    | URL of the category image (optional)                                       |
| `isActive`    | Boolean| ❌ No    | Whether the category is active (default: `true`)                           |
| `isPin`       | Boolean| ❌ No    | Whether the category is pinned (default: `false`)                          |

---

#### 📤 Response (JSON)

**For Successful Category Creation**:

```json
{
  "status": "success",
  "statusCode": 201,
  "message": "Category created successfully.",
  "data": {
    "categoryId": "64c0f9f4e4b0a5d6c8f9e789",
    "name": "Vegetables"
  }
}
```

---

#### 2. **Update Category**

Allows a vendor to update an existing category.

**Endpoint**: `PUT /api/v1/category/update/:categoryId`

---

#### 📥 Request Body (JSON)

| Field         | Type   | Required | Description                                                                 |
|---------------|--------|----------|-----------------------------------------------------------------------------|
| `name`        | String | ❌ No    | Name of the category                                                       |
| `description` | String | ❌ No    | Description of the category (optional)                                     |
| `image`       | String | ❌ No    | URL of the category image (optional)                                       |
| `isActive`    | Boolean| ❌ No    | Whether the category is active                                             |
| `isPin`       | Boolean| ❌ No    | Whether the category is pinned                                             |

---

#### 📤 Response (JSON)

**For Successful Category Update**:

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Category updated successfully.",
  "data": {
    "categoryId": "64c0f9f4e4b0a5d6c8f9e789",
    "name": "Fresh Vegetables"
  }
}
```

---

#### 3. **Delete Category**

Allows a vendor to delete an existing category.

**Endpoint**: `DELETE /api/v1/category/delete/:categoryId`

---

#### 📤 Response (JSON)

**For Successful Category Deletion**:

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Category deleted successfully."
}
```


## 📊 Dashboard API

### 🧾 Description

This document provides details about the **Dashboard API** for the MandiExpress backend.  
The dashboard provides an overview of key metrics, recent activities, and other relevant data for vendors, suppliers, and admins.

---

### 🚀 Endpoints


---

#### 3. **Get Dashboard **

Fetches a summary of the dashboard, including key metrics and highlights.

**Endpoint**: `GET /api/v1/dashboard/summary`

---

#### 📤 Response (JSON)

**For Successful Request**:
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Dashboard summary fetched successfully.",
  "data": {
    "totalRevenue": 50000,
    "totalOrders": 120,
    "totalUsers": 100,
    "topCategories": [
      {
        "categoryId": "64c0f9f4e4b0a5d6c8f9e789",
        "name": "Vegetables",
        "productCount": 50
      },
      {
        "categoryId": "64c0f9f4e4b0a5d6c8f9e456",
        "name": "Fruits",
        "productCount": 30
      }
    ]
  }
}
```

---


## 🛠️ Notes

1. **Validation**:
   - Ensure all required fields are validated properly.
   - Use unique constraints where applicable (e.g., category name).

2. **Authorization**:
   - Restrict access to authorized users only.

3. **Error Handling**:
   - Handle edge cases like invalid IDs, missing fields, or unauthorized access.

4. **Testing**:
   - Test all endpoints with various inputs to ensure they handle edge cases correctly.
