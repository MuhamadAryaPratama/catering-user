# Shopping Cart Documentation

## Overview

The shopping cart functionality allows users to manage items in their shopping cart, including adding, updating, retrieving, and deleting items.

## API Endpoints

### GET /api/cart

Retrieve all shopping cart items.

**Response:**

```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "nama_menu": "Menu Item",
            "jumlah": 2,
            "harga_satuan": 10000,
            "harga_total": 20000
        },
        ...
    ]
}
```

### POST /api/cart

Create a new shopping cart item.

**Request:**

```json
{
    "nama_menu": "New Menu Item",
    "jumlah": 1,
    "harga_satuan": 15000
}
```

**Response:**

```json
{
    "status": "success",
    "data": {
        "id": 1,
        "nama_menu": "New Menu Item",
        "jumlah": 1,
        "harga_satuan": 15000,
        "harga_total": 15000
    }
}
```

### PUT /api/cart/{id}

Update an existing shopping cart item.

**Request:**

```json
{
    "jumlah": 3 // optional
}
```

**Response:**

```json
{
    "status": "success",
    "data": {
        "id": 1,
        "nama_menu": "Menu Item",
        "jumlah": 3,
        "harga_satuan": 10000,
        "harga_total": 30000
    }
}
```

### DELETE /api/cart/{id}

Delete a shopping cart item.

**Response:**

```json
{
    "status": "success",
    "message": "Cart item deleted"
}
```

## Model Structure

### ShoppingCart Model

-   **Fillable Attributes**: `nama_menu`, `jumlah`, `harga_satuan`, `harga_total`.

## Example Requests and Responses

-   See the above sections for example requests and responses for each endpoint.

## Error Handling

Common error responses include:

-   Validation errors (e.g., missing required fields).
-   Not found errors when attempting to access a non-existent cart item.
