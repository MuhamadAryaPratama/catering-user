## Overview

The `AuthController` class handles user authentication, including registration, login, password changes, and token management. It provides endpoints for managing user sessions and securing access to protected resources.

## Methods

### register()

-   **Description**: Registers a new user.
-   **Request Parameters**:
    -   `name`: string, required
    -   `email`: string, required, must be a valid email format
    -   `password`: string, required, must be at least 8 characters
-   **Response**:
    -   **Success**:
        -   Status: 201 Created
        -   Message: "Pendaftaran Berhasil"
    -   **Error**:
        -   Status: 400 Bad Request or 500 Internal Server Error
        -   Message: Validation errors or "Pendaftaran gagal"

### login()

-   **Description**: Authenticates a user and returns a JWT token.
-   **Request Parameters**:
    -   `email`: string, required
    -   `password`: string, required
-   **Response**:
    -   **Success**:
        -   Status: 200 OK
        -   Access Token: JWT token
    -   **Error**:
        -   Status: 401 Unauthorized
        -   Message: "Password anda salah"

### me()

-   **Description**: Returns the authenticated user's information.
-   **Response**:
    -   **Success**:
        -   Status: 200 OK
        -   User data in JSON format

### logout()

-   **Description**: Logs the user out and invalidates the token.
-   **Response**:
    -   **Success**:
        -   Status: 200 OK
        -   Message: "Successfully logged out"

### refresh()

-   **Description**: Refreshes the JWT token.
-   **Response**:
    -   **Success**:
        -   Status: 200 OK
        -   New access token and expiration details

### changePassword()

-   **Description**: Changes the authenticated user's password.
-   **Request Parameters**:
    -   `password`: string, required, must be at least 8 characters
    -   `password_confirmation`: string, required, must match the password
-   **Response**:
    -   **Success**:
        -   Status: 200 OK
        -   Message: "Password berhasil diubah"
    -   **Error**:
        -   Status: 400 Bad Request or 500 Internal Server Error
        -   Message: Validation errors or "Gagal mengubah password"

## Response Structure

All responses are returned in JSON format with a `status` field indicating success or error, and a `message` field providing additional information.
