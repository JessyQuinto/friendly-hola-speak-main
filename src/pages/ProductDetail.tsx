import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { productService } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import { Star, ShoppingCart, Minus, Plus, ArrowLeft, MapPin } from "lucide-react";
import type { Product } from "@/types";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, isLoading: cartLoading } = useCart();

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      const productData = await productService.getProductBySlug(slug);
      setProduct(productData);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product.id, quantity);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </div>
            <div className="space-y-4">
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Producto no encontrado</h1>
          <p className="text-muted-foreground mb-6">
            El producto que buscas no existe o ya no está disponible.
          </p>
          <Button onClick={() => navigate("/products")}>
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img
              src={product.images[selectedImage] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.category.name}</Badge>
              {product.featured && <Badge variant="outline">Destacado</Badge>}
              {!product.isInStock && <Badge variant="destructive">Agotado</Badge>}
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {renderStars(product.rating)}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({product.rating})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {product.hasDiscount && product.discountedPrice && (
                <span className="text-2xl font-bold text-primary">
                  ${product.discountedPrice.toLocaleString()}
                </span>
              )}
              <span
                className={`text-xl ${
                  product.hasDiscount
                    ? "line-through text-muted-foreground"
                    : "font-bold text-primary"
                }`}
              >
                ${product.price.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{product.producer.location}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Descripción</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Acerca del Productor</h3>
              <div className="space-y-2">
                <p className="font-medium">{product.producer.name}</p>
                {product.producer.description && (
                  <p className="text-sm text-muted-foreground">
                    {product.producer.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{product.producer.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Add to Cart Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {product.stock > 0 ? (
                  <span>{product.stock} disponibles</span>
                ) : (
                  <span className="text-destructive">Sin stock</span>
                )}
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.isInStock || cartLoading}
              className="w-full"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {cartLoading ? "Agregando..." : "Agregar al Carrito"}
            </Button>

            {!product.isAvailableForPurchase && (
              <p className="text-sm text-muted-foreground text-center">
                Este producto no está disponible para compra en este momento.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Estado:</span>
              <span className={`ml-2 ${product.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                {product.status === 'Active' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div>
              <span className="font-medium">SKU:</span>
              <span className="ml-2 text-muted-foreground">#{product.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;