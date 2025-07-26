const User_Constant = {
  // Success Messages
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  USER_FETCHED: "User fetched successfully",

  // Error Messages
  USER_CREATION_FAILED: "User creation failed",
  USER_UPDATE_FAILED: "User update failed",
  USER_DELETION_FAILED: "User deletion failed",
  USER_NOT_FOUND: "User not found",
  USER_FETCH_FAILED: "Failed to fetch user",

  // Validation Messages
  INVALID_USER_DATA: "Invalid user data provided",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  PHONE_ALREADY_EXISTS: "Phone number already exists",
};

export default Object.freeze(User_Constant);