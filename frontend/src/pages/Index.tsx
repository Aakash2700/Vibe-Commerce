import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Cart } from "@/components/Cart";
import { CheckoutDialog } from "@/components/CheckoutDialog";
import { ReceiptDialog } from "@/components/ReceiptDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag } from "lucide-react";
import { productsAPI, cartAPI, checkoutAPI, type Product, type CartItem, type Receipt } from "@/services/api";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
    fetchCartItems();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      const cartData = await cartAPI.getCart();
      setCartItems(cartData.items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast({
        title: "Error",
        description: "Failed to load cart",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const existingItem = cartItems.find(item => item.product_id === product.id);

      if (existingItem) {
        await handleUpdateQuantity(existingItem.id, existingItem.quantity + 1);
        return;
      }

      await cartAPI.addItem(product.id, 1);

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });

      fetchCartItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      await cartAPI.updateQuantity(id, quantity);
      fetchCartItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await cartAPI.removeItem(id);

      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });

      fetchCartItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart first",
        variant: "destructive",
      });
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSubmit = async (customerInfo: { name: string; email: string }) => {
    try {
      const checkoutData = cartItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const data = await checkoutAPI.checkout(checkoutData, customerInfo);

      setReceipt(data);
      setIsCheckoutOpen(false);
      setIsReceiptOpen(true);
      setCartItems([]);
      
      toast({
        title: "Order placed!",
        description: "Your order has been successfully placed",
      });
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-xl z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/70">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Vibe Commerce
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Cart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="mb-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 border border-primary/20 backdrop-blur-sm">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            Welcome to Vibe Commerce
          </h2>
          <p className="text-lg text-muted-foreground mb-6 animate-fade-in">
            Discover premium products with seamless shopping experience
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          />
        </div>

        {/* Products Header */}
        <div className="mb-8 md:mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 animate-fade-in">
              {searchQuery ? "Search Results" : "Featured Products"}
            </h2>
            <p className="text-muted-foreground animate-fade-in">
              {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"} available
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No products found matching your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        )}
      </main>

      <CheckoutDialog
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        onSubmit={handleCheckoutSubmit}
      />

      <ReceiptDialog
        open={isReceiptOpen}
        onOpenChange={setIsReceiptOpen}
        receipt={receipt}
      />
    </div>
  );
};

export default Index;
