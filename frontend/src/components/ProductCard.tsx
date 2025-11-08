import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await onAddToCart(product);
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-border/50 bg-card relative">
      {/* Favorite Button */}
      <button
        onClick={() => setIsFavorited(!isFavorited)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur hover:bg-background transition-all duration-200 group-hover:scale-110"
      >
        <Heart
          className={`h-5 w-5 transition-all duration-300 ${
            isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
          }`}
        />
      </button>

      {/* Image Section */}
      <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50 relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
          ${product.price}
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-primary uppercase tracking-wide bg-primary/10 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-200 group-hover:shadow-lg"
        >
          <ShoppingCart className={`mr-2 h-4 w-4 transition-transform ${isAdding ? "animate-bounce" : ""}`} />
          {isAdding ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};
