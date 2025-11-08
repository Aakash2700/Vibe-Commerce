# Vibe Commerce - Full Stack E-Commerce App

A complete shopping cart application built with React frontend and Node/Express backend for Vibe Commerce screening.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm

### Installation & Setup

1. **Install dependencies:**
   ```bash
   cd frontend && npm install && cd ..
   cd backend && npm install && cd ..
   ```

2. **Start Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

3. **Start Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## ✨ Features

### Frontend
- ✅ Product grid with responsive design
- ✅ Shopping cart (add/remove/update quantity)
- ✅ Checkout form with validation
- ✅ Order receipt modal
- ✅ Dark/light theme toggle
- ✅ Smooth animations
- ✅ Error handling with notifications

### Backend
- ✅ REST API for products, cart, checkout
- ✅ Mock data initialization
- ✅ Fake Store API integration (optional)
- ✅ In-memory storage
- ✅ CORS enabled
- ✅ Full error handling

## 📋 API Endpoints

All endpoints prefixed with `/api`:

**Products:**
- `GET /products` - Get all products

**Cart:**
- `GET /cart` - Get cart items + total
- `POST /cart` - Add item (body: {productId, qty})
- `PUT /cart/:id` - Update quantity (body: {quantity})
- `DELETE /cart/:id` - Remove item

**Checkout:**
- `POST /checkout` - Process checkout (body: {cartItems, customerInfo})

**Health:**
- `GET /health` - API status

See `backend/README.md` for detailed documentation.

## 🛠 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- React Router + React Query
- Lucide Icons

**Backend:**
- Node.js + Express
- CORS + UUID
- Axios (Fake Store API integration)

## 📁 Project Structure

```
Vibe-Commerce-main/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # UI components
│   │   ├── services/      # API service layer
│   │   └── hooks/         # Custom hooks
│   └── package.json
├── backend/               # Express API
│   ├── server.js         # Main server
│   ├── package.json
│   └── README.md         # Backend docs
├── .env                  # Environment config
└── README.md             # This file
```

## 🧪 Testing

### Manual Checklist
- [ ] Products load correctly
- [ ] Add to cart updates badge
- [ ] Cart displays items with prices
- [ ] Update quantity recalculates total
- [ ] Remove item works
- [ ] Checkout form validates
- [ ] Receipt displays after checkout
- [ ] Cart clears after checkout
- [ ] Theme toggle works
- [ ] Responsive on mobile/tablet/desktop

### API Testing
```bash
# Get products
curl http://localhost:5000/api/products

# Add to cart
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": "id", "qty": 1}'

# Checkout
curl -X POST http://localhost:5000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"cartItems": [...], "customerInfo": {...}}'
```

## 📚 Documentation

- **backend/README.md** - Backend API documentation
- **frontend/src/services/api.ts** - Frontend API client

## 🚢 Deployment

### Frontend
- Build: `npm run build`
- Deploy `dist/` to Netlify/Vercel

### Backend
- Deploy to Heroku, Railway, Render, or AWS
- Set `PORT` environment variable
- Update `VITE_API_URL` to production backend URL

## 🎯 Requirements Met

✅ Backend APIs (GET /products, POST/DELETE/GET /cart, POST /checkout)
✅ Frontend (products grid, cart view, checkout form, receipt modal)
✅ Responsive design
✅ Mock checkout with receipts
✅ Mock data initialization
✅ Fake Store API integration (optional)
✅ Error handling
✅ DB integration ready (Supabase configured)

## 📝 Notes

- Data stored in-memory (resets on server restart)
- For production, integrate MongoDB/PostgreSQL
- Supabase configuration available for future use
- No real payments (mock checkout only)

## 🔗 Links

- [Backend README](./backend/README.md)
- [Fake Store API](https://fakestoreapi.com)

## 📄 License

MIT
