# API Endpoints

**Base URL:** `http://localhost:8000/api/v1`

🔒 = Requires JWT authentication

---

## Auth (`/auth`)

| Method | Endpoint           | Auth | Description                          |
| ------ | ------------------ | ---- | ------------------------------------ |
| POST   | `/auth/register`   |      | Register a new user                  |
| POST   | `/auth/login`      |      | Login (returns tokens as cookies)    |
| POST   | `/auth/logout`     | 🔒   | Logout and clear tokens              |
| POST   | `/auth/refresh`    |      | Rotate access & refresh tokens       |
| GET    | `/auth/check-auth` | 🔒   | Verify authentication status         |

## Users (`/users`)

| Method | Endpoint             | Auth | Description                 |
| ------ | -------------------- | ---- | --------------------------- |
| GET    | `/users/me`          | 🔒   | Get current user profile    |
| PATCH  | `/users/me`          | 🔒   | Update account details      |
| PATCH  | `/users/me/password` | 🔒   | Change password             |
| PATCH  | `/users/me/role`     | 🔒   | Upgrade role to SELLER      |

## Addresses (`/addresses`)

| Method | Endpoint                  | Auth | Description                       |
| ------ | ------------------------- | ---- | --------------------------------- |
| POST   | `/addresses/add`          | 🔒   | Add a new address (max 5)         |
| GET    | `/addresses/`             | 🔒   | List all addresses (paginated)    |
| GET    | `/addresses/:addressId`   | 🔒   | Get address by ID                 |
| PATCH  | `/addresses/:addressId`   | 🔒   | Update an address                 |
| DELETE | `/addresses/:addressId`   | 🔒   | Delete an address                 |

## Products — Shop (`/shop`)

| Method | Endpoint             | Auth | Description                              |
| ------ | -------------------- | ---- | ---------------------------------------- |
| GET    | `/shop/products`     |      | List products (search, filter, paginate) |
| GET    | `/shop/:productId`   |      | Get product details                      |

## Seller (`/seller`)

| Method | Endpoint                        | Auth | Description                          |
| ------ | ------------------------------- | ---- | ------------------------------------ |
| POST   | `/seller/products/add`          |      | Add product with images (multipart)  |
| GET    | `/seller/products`              |      | List seller's products               |
| DELETE | `/seller/products/:productId`   |      | Delete a product + Cloudinary images |

## Cart (`/cart`)

| Method | Endpoint             | Auth | Description                  |
| ------ | -------------------- | ---- | ---------------------------- |
| GET    | `/cart/`             | 🔒   | Get cart contents            |
| POST   | `/cart/:productId`   | 🔒   | Add product to cart          |
| PATCH  | `/cart/:productId`   | 🔒   | Reduce product quantity      |
| DELETE | `/cart/:productId`   | 🔒   | Remove product from cart     |

## Orders (`/order`)

| Method | Endpoint                    | Auth | Description              |
| ------ | --------------------------- | ---- | ------------------------ |
| POST   | `/order/`                   | 🔒   | Create order from cart   |
| GET    | `/order/`                   | 🔒   | List all user orders     |
| GET    | `/order/:orderId`           | 🔒   | Get order details        |
| PATCH  | `/order/:orderId/cancel`    | 🔒   | Cancel an order          |

## Payments (`/payment`)

| Method | Endpoint                      | Auth | Description                        |
| ------ | ----------------------------- | ---- | ---------------------------------- |
| POST   | `/payment/orders/:orderId`    | 🔒   | Create Razorpay payment order      |
| POST   | `/payment/verify`             | 🔒   | Verify Razorpay payment signature  |

## Reviews (⚠️ No Routes Registered)

| Function        | Description                                  |
| --------------- | -------------------------------------------- |
| `giveReview`    | Create a review (rating 1–5 + comment)       |
| `getAllReviews`  | Get all reviews by the authenticated user    |
| `getReview`     | Get review for a specific product            |

> Review controller exists but has no route file — these endpoints are currently inaccessible.
