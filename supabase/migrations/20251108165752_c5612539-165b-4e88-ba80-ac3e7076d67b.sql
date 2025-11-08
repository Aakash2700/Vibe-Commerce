-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  description TEXT,
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 100 CHECK (stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Anyone can view products" 
  ON public.products 
  FOR SELECT 
  USING (true);

-- Public access for cart items (demo purposes)
CREATE POLICY "Anyone can manage cart items" 
  ON public.cart_items 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Insert sample products
INSERT INTO public.products (name, price, description, category, image_url) VALUES
  ('Wireless Headphones', 129.99, 'Premium noise-cancelling headphones with 30hr battery', 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'),
  ('Smart Watch', 299.99, 'Fitness tracking smartwatch with heart rate monitor', 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'),
  ('Laptop Stand', 49.99, 'Ergonomic aluminum laptop stand for better posture', 'Accessories', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'),
  ('Mechanical Keyboard', 159.99, 'RGB mechanical gaming keyboard with custom switches', 'Electronics', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'),
  ('Wireless Mouse', 79.99, 'Precision wireless mouse with ergonomic design', 'Electronics', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'),
  ('USB-C Hub', 39.99, '7-in-1 USB-C hub with HDMI and ethernet ports', 'Accessories', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500'),
  ('Desk Lamp', 69.99, 'LED desk lamp with adjustable brightness and color', 'Accessories', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'),
  ('Phone Case', 24.99, 'Slim protective case with wireless charging support', 'Accessories', 'https://images.unsplash.com/photo-1601593346740-925612772716?w=500');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for cart_items
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();