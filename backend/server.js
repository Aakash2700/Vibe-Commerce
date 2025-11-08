import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (simulating database)
let products = [];
let cartItems = [];
let orders = [];

// Initialize mock products
const initializeMockProducts = async () => {
  const mockProducts = [
    {
      id: uuidv4(),
      name: 'Wireless Headphones',
      price: 129.99,
      description: 'Premium noise-cancelling headphones with 30hr battery',
      category: 'Electronics',
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
    },
    {
      id: uuidv4(),
      name: 'Smart Watch',
      price: 299.99,
      description: 'Fitness tracking smartwatch with heart rate monitor',
      category: 'Electronics',
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
    },
    {
      id: uuidv4(),
      name: 'Laptop Stand',
      price: 49.99,
      description: 'Ergonomic aluminum laptop stand for better posture',
      category: 'Accessories',
      image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'
    },
    {
      id: uuidv4(),
      name: 'Mechanical Keyboard',
      price: 159.99,
      description: 'RGB mechanical gaming keyboard with custom switches',
      category: 'Electronics',
      image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'
    },
    {
      id: uuidv4(),
      name: 'Wireless Mouse',
      price: 79.99,
      description: 'Precision wireless mouse with ergonomic design',
      category: 'Electronics',
      image_url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'
    },
    {
      id: uuidv4(),
      name: 'USB-C Hub',
      price: 39.99,
      description: '7-in-1 USB-C hub with HDMI and ethernet ports',
      category: 'Accessories',
      image_url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500'
    },
    {
      id: uuidv4(),
      name: 'Desk Lamp',
      price: 69.99,
      description: 'LED desk lamp with adjustable brightness and color',
      category: 'Accessories',
      image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'
    },
    {
      id: uuidv4(),
      name: 'Phone Case',
      price: 24.99,
      description: 'Slim protective case with wireless charging support',
      category: 'Accessories',
      image_url: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=500'
    }
  ];

  products = mockProducts;
  console.log('✓ Mock products initialized');
};

// Optional: Load products from Fake Store API
const loadFakeStoreProducts = async () => {
  try {
    console.log('Attempting to load products from Fake Store API...');
    const response = await axios.get('https://fakestoreapi.com/products?limit=8');
    
    const fakeStoreProducts = response.data.map((item) => ({
      id: uuidv4(),
      name: item.title,
      price: item.price,
      description: item.description,
      category: item.category,
      image_url: item.image
    }));

    products = fakeStoreProducts;
    console.log('✓ Products loaded from Fake Store API');
  } catch (error) {
    console.log('⚠ Fake Store API unavailable, using mock products instead');
    await initializeMockProducts();
  }
};

// Routes

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// POST /api/cart - Add item to cart
app.post('/api/cart', (req, res) => {
  const { productId, qty } = req.body;

  if (!productId || !qty) {
    return res.status(400).json({ error: 'productId and qty are required' });
  }

  // Check if product exists
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Check if item already in cart
  const existingItem = cartItems.find(item => item.product_id === productId);
  
  if (existingItem) {
    existingItem.quantity += qty;
    return res.json(existingItem);
  }

  // Add new item to cart
  const cartItem = {
    id: uuidv4(),
    product_id: productId,
    quantity: qty,
    name: product.name,
    price: product.price,
    image_url: product.image_url
  };

  cartItems.push(cartItem);
  res.status(201).json(cartItem);
});

// GET /api/cart - Get all cart items with total
app.get('/api/cart', (req, res) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.json({
    items: cartItems,
    total: parseFloat(total.toFixed(2)),
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  });
});

// DELETE /api/cart/:id - Remove item from cart
app.delete('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  const index = cartItems.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Cart item not found' });
  }

  const removedItem = cartItems.splice(index, 1);
  res.json({ message: 'Item removed', item: removedItem[0] });
});

// PUT /api/cart/:id - Update cart item quantity
app.put('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }

  const cartItem = cartItems.find(item => item.id === id);
  if (!cartItem) {
    return res.status(404).json({ error: 'Cart item not found' });
  }

  cartItem.quantity = quantity;
  res.json(cartItem);
});

// POST /api/checkout - Process checkout
app.post('/api/checkout', (req, res) => {
  const { cartItems: items, customerInfo } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  if (!customerInfo || !customerInfo.name || !customerInfo.email) {
    return res.status(400).json({ error: 'Customer name and email are required' });
  }

  // Calculate total
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Create receipt
  const receipt = {
    orderId: uuidv4(),
    timestamp: new Date().toISOString(),
    customerInfo: {
      name: customerInfo.name,
      email: customerInfo.email
    },
    items: items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity
    })),
    total: parseFloat(total.toFixed(2)),
    status: 'completed'
  };

  // Store order
  orders.push(receipt);

  // Clear cart
  cartItems = [];

  res.status(201).json(receipt);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Vibe Commerce API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const startServer = async () => {
  // Try to load from Fake Store API, fallback to mock products
  await loadFakeStoreProducts();

  app.listen(PORT, () => {
    console.log(`\n🚀 Vibe Commerce API running on http://localhost:${PORT}`);
    console.log(`📦 Products: ${products.length}`);
    console.log(`🛒 Cart items: ${cartItems.length}\n`);
  });
};

startServer();
