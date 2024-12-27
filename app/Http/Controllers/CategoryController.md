# Category Documentation

## Overview

The `Category` functionality allows for the management of categories within the application, including creating, updating, retrieving, and deleting categories.

## API Endpoints

### GET /api/categories

Retrieve all categories.

**Response:**

```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "name": "Category Name",
            "image_url": "http://example.com/storage/category/image.jpg"
        },
        ...
    ]
}
```

### POST /api/categories

Create a new category.

**Request:**

```json
{
    "name": "New Category",
    "image": "image_file"
}
```

**Response:**

```json
{
    "status": "success",
    "message": "Category added successfully",
    "data": {
        "id": 1,
        "name": "New Category",
        "image_url": "http://example.com/storage/category/image.jpg"
    }
}
```

### PUT /api/categories/{id}

Update an existing category.

**Request:**

```json
{
    "name": "Updated Category",
    "image": "image_file" // optional
}
```

**Response:**

```json
{
    "status": "success",
    "data": {
        "id": 1,
        "name": "Updated Category",
        "image_url": "http://example.com/storage/category/image.jpg"
    }
}
```

### DELETE /api/categories/{id}

Delete a category.

**Response:**

```json
{
    "status": "success",
    "message": "Category deleted"
}
```

### GET /api/categories/{id}/foods

Retrieve foods associated with a category.

**Response:**

```json
{
    "status": "success",
    "category": {
        "id": 1,
        "name": "Category Name",
        "image_url": "http://example.com/storage/category/image.jpg"
    },
    "foods": [
        {
            "id": 1,
            "name": "Food Name",
            "gambar_url": "http://example.com/storage/foods/image.jpg"
        },
        ...
    ]
}
```

## Model Structure

### Category Model

-   **Fillable Attributes**: `name`, `image`.
-   **Relationships**:
    -   `foods`: One-to-many relationship with the `Food` model.

## Example Requests and Responses

-   See the above sections for example requests and responses for each endpoint.

## Error Handling

Common error responses include:

-   Validation errors (e.g., missing required fields).
-   Not found errors when attempting to access a non-existent category.
