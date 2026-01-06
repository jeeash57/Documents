# HAIRCARE Project

This project consists of a Flask backend and a React (Vite) frontend.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Python 3.x](https://www.python.org/downloads/)
- [Node.js and npm](https://nodejs.org/)

---

## Getting Started

To run the full application, you need to start both the backend and the frontend.

### 1. Backend (Flask)

The backend is located in the root directory (`api.py`).

1.  **Install dependencies:**
    ```powershell
    pip install -r requirements.txt
    ```
2.  **Run the API:**
    ```powershell
    python api.py
    ```
    The API will be available at `http://127.0.0.1:8000`.

### 2. Frontend (React + Vite)

The frontend is located in the `frontend/` directory.

1.  **Navigate to the frontend folder:**
    ```powershell
    cd frontend
    ```
2.  **Install dependencies:**
    ```powershell
    npm install
    ```
3.  **Run the development server:**
    ```powershell
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173`.

---

## API Endpoints

- `GET /hello`: Returns a greeting message.
- `GET /products`: Returns a list of all 30 haircare products.
- `GET /products/<id>`: Returns details for a specific product.
- `POST /orders`: Accepts order data (items, customer, payment) and saves it to `orders.json`.

## Features implemented

1.  **Product Catalog:** 30 high-quality haircare products loaded from `products.json`.
2.  **Pricing Tiers:** Support for Retail, Wholesale, and Premium Wholesale prices, switchable on the Products page.
3.  **Global Cart:** React Context-based cart that persists across pages with real-time Navbar badge.
4.  **Checkout Flow:** A multi-step flow from Cart to Checkout form, ending with an order confirmation and backend logging.
5.  **Order Persistence:** Orders are saved to `orders.json` on the server for later processing.

## Cart and Checkout Flow

1.  Browse products on the **Haircare** page.
2.  Select your pricing tier (Retail/Wholesale/Premium).
3.  Add items to your cart.
4.  View and manage items in the **Cart** (`/cart`).
5.  Proceed to **Checkout** (`/checkout`) to enter details and place your order.
6.  Orders are "Pending Payment" until a real payment gateway (like Stripe) is integrated in the next phase.
