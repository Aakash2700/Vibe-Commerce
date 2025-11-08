# Vibe Commerce Backend API

A Node.js/Express REST API for the Vibe Commerce e-commerce application.

## Features

- ✅ Product management (GET all products)
- ✅ Shopping cart operations (add, remove, update, view)
- ✅ Mock checkout with receipt generation
- ✅ In-memory data storage (can be extended to use database)
- ✅ Optional Fake Store API integration
- ✅ CORS enabled for frontend integration
- ✅ Error handling and validation

## Installation

```bash
cd backend
npm install
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` by default.

You can change the port by setting the `PORT` environment variable:
```bash
PORT=3001 npm start
```

## API Endpoints

### Products

**GET /api/products**
- Returns all available products
- Response: Array of products with id, name, price, description, category, image_url

```bash
curl http://localhost:5000/api/products
```

### Cart

**GET /api/cart**
- Returns all cart items and total
- Response: { items: [], total: number, itemCount: number }

```bash
curl http://localhost:5000/api/cart
```

**POST /api/cart**
- Add item to cart
- Body: { productId: string, qty: number }
- Response: Cart item object

```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": "product-id", "qty": 1}'
```

**PUT /api/cart/:id**
- Update cart item quantity
- Body: { quantity: number }
- Response: Updated cart item

```bash
curl -X PUT http://localhost:5000/api/cart/item-id \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'
```

**DELETE /api/cart/:id**
- Remove item from cart
- Response: { message: "Item removed", item: {...} }

```bash
curl -X DELETE http://localhost:5000/api/cart/item-id
```

### Checkout

**POST /api/checkout**
- Process checkout and generate receipt
- Body: { cartItems: [...], customerInfo: { name: string, email: string } }
- Response: Receipt object with orderId, timestamp, items, total, status

```bash
curl -X POST http://localhost:5000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "cartItems": [
      {"name": "Product", "price": 99.99, "quantity": 1}
    ],
    "customerInfo": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }'
```

### Health Check

**GET /api/health**
- Check if API is running
- Response: { status: "ok", message: "..." }

```bash
curl http://localhost:5000/api/health
```

## Data Sources

The API initializes products from two sources (in order of preference):

1. **Fake Store API** (https://fakestoreapi.com) - If available, loads 8 real products
2. **Mock Products** - If Fake Store API is unavailable, uses built-in mock data

## Architecture

- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **UUID**: Unique ID generation
- **Axios**: HTTP client for Fake Store API integration
- **In-Memory Storage**: Simple data persistence (resets on server restart)

## Notes

- This is a mock backend suitable for screening/demo purposes
- Data is stored in memory and will be lost when the server restarts
- For production use, integrate with a real database (MongoDB, PostgreSQL, etc.)
- No authentication/authorization is implemented (suitable for demo)

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- User authentication
- Order history tracking
- Payment processing
- Inventory management
- Admin dashboard
