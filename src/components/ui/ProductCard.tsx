import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { orderService } from "@/services/orderService";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  onToggleWishlist?: (productId: number) => void;
  isInWishlist?: boolean;
}

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist = false 
}: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!product.isAvailableForPurchase || !product.isInStock) return;
    
    setIsLoading(true);
    try {
      await onAddToCart?.(product.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-card border-border/50">
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <Link to={`/products/${product.slug}`} className="block relative">
          <div className="aspect-square overflow-hidden bg-cream-soft">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-chocolate-dark/0 group-hover:bg-chocolate-dark/20 transition-colors duration-300" />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <Badge className="bg-primary text-primary-foreground font-semibold">
              Destacado
            </Badge>
          )}
          {product.hasDiscount && (
            <Badge className="bg-destructive text-destructive-foreground">
              -{Math.round(((product.price - product.currentPrice) / product.price) * 100)}%
            </Badge>
          )}
          {!product.isInStock && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Agotado
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 backdrop-blur hover:bg-background/90 ${
            isInWishlist ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
          }`}
          onClick={() => onToggleWishlist?.(product.id)}
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </Button>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Category & Producer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="bg-secondary/50 px-2 py-1 rounded-full">
            {product.category.name}
          </span>
          <span>{product.producer.location}</span>
        </div>

        {/* Product Title */}
        <div className="space-y-1">
          <Link 
            to={`/products/${product.slug}`}
            className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors"
          >
            {product.name}
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            ({product.rating})
          </span>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              {orderService.formatPrice(product.currentPrice)}
            </span>
            {product.hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {orderService.formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleAddToCart}
            disabled={!product.isAvailableForPurchase || !product.isInStock || isLoading}
            className="flex-1"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4" />
            {isLoading ? 'Agregando...' : 'Agregar'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link to={`/products/${product.slug}`}>
              Ver detalles
            </Link>
          </Button>
        </div>

        {/* Stock indicator */}
        {product.isInStock && product.stock <= 5 && (
          <p className="text-xs text-destructive font-medium">
            ¡Últimas {product.stock} unidades!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;