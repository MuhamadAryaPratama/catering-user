## Overview

The `FoodController` class handles operations related to food items, including listing, creating, updating, and deleting food entries. It provides endpoints for managing food data in the application.

## Methods

### index()

-   **Description**: Retrieves a list of all food items.
-   **Response**:
    -   **Success**:
        -   Status: 200 OK
        -   Data: List of food items in JSON format

### store(Request $request)

-   **Description**: Creates a new food item.
-   **Request Parameters**:
    -   `nama`: string, required
    -   `deskripsi`: string, required
    -   `harga`: numeric, required, must be at least 0
    -   `category_id`: integer, required, must exist in categories table
    -   `gambar`: image, optional
-   **Response**:
    -   **Success**:
        -   Status: 201 Created
        -   Message: "Food added successfully"
        -   Data: Created food item in JSON format
    -   **Error**:
        -   Status: 400 Bad Request
        -   Message: Validation errors

### show($id)

-   **Description**: Retrieves a specific food item by ID.
-   **Response**:
    -   **Success**:
        -   Status: 200 OK
        -   Data: Food item in JSON format
    -   **Error**:
        -   Status: 404 Not Found
        -   Message: "Food not found"

### update(Request $request, $id)

-   **Description**: Updates an existing food item.
-   **Request Parameters**:
    -   `nama`: string, optional
    -   `deskripsi`: string, optional
    -   `harga`: numeric, optional, must be at least 0
    -   `gambar`: image, optional
-   **Response**:
    -   **Success**:
        -   Status: 200 OK
        -   Data: Updated food item in JSON format
    -   **Error**:
        -   Status: 404 Not Found
        -   Message: "Food not found"

### destroy($id)

-   **Description**: Deletes a specific food item by ID.
-   **Response**:
    -   **Success**:
        -   Status: 200 OK
        -   Message: "Food deleted"
    -   **Error**:
        -   Status: 404 Not Found
        -   Message: "Food not found"

## Response Structure

All responses are returned in JSON format with a `status` field indicating success or error, and a `message` field providing additional information.
