import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import type { CreateOrderRequest } from "@/types";
import { toast } from "@/hooks/use-toast";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, isLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  const [shippingData, setShippingData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    address: user?.address || "",
    city: "",
    region: "",
    zipCode: "",
    phone: user?.phone || "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState<"CreditCard" | "DebitCard" | "BankTransfer" | "Cash">("CreditCard");
  const [notes, setNotes] = useState("");

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    
    setIsCheckingOut(true);
    
    try {
      const orderData: CreateOrderRequest = {
        paymentMethod,
        shippingAddress: shippingData,
        notes: notes.trim() || undefined,
      };
      
      const order = await orderService.createOrder(orderData);
      
      toast({
        title: "¡Orden creada exitosamente!",
        description: `Tu orden #${order.id} ha sido procesada.`,
      });
      
      navigate("/profile");
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Acceso Requerido</h1>
          <p className="text-muted-foreground mb-6">
            Debes iniciar sesión para ver tu carrito de compras
          </p>
          <Button onClick={() => navigate("/login")}>
            Iniciar Sesión
          </Button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
          <p className="text-muted-foreground mb-6">
            ¡Explora nuestros deliciosos chocolates artesanales!
          </p>
          <Button onClick={() => navigate("/products")}>
            Explorar Productos
          </Button>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Finalizar Compra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Shipping Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dirección de Envío</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={shippingData.name}
                    onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={shippingData.address}
                  onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="region">Departamento</Label>
                  <Input
                    id="region"
                    value={shippingData.region}
                    onChange={(e) => setShippingData({ ...shippingData, region: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="zipCode">Código Postal</Label>
                <Input
                  id="zipCode"
                  value={shippingData.zipCode}
                  onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Método de Pago</h3>
              <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CreditCard">Tarjeta de Crédito</SelectItem>
                  <SelectItem value="DebitCard">Tarjeta de Débito</SelectItem>
                  <SelectItem value="BankTransfer">Transferencia Bancaria</SelectItem>
                  <SelectItem value="Cash">Pago contra entrega</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notas adicionales (opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Instrucciones especiales para la entrega..."
              />
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span>Subtotal ({cart.totalItems} productos)</span>
                <span>{orderService.formatPrice(cart.total)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>{orderService.formatPrice(cart.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setShowCheckout(false)}>
                Volver al Carrito
              </Button>
              <Button 
                onClick={handleCheckout} 
                disabled={isCheckingOut}
                className="flex-1"
              >
                {isCheckingOut ? "Procesando..." : "Confirmar Pedido"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Carrito de Compras</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.productName}</h3>
                    <p className="text-muted-foreground">
                      {orderService.formatPrice(item.unitPrice)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={isLoading}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        disabled={isLoading}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {orderService.formatPrice(item.totalPrice)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={isLoading}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Productos ({cart.totalItems})</span>
                <span>{orderService.formatPrice(cart.total)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>{orderService.formatPrice(cart.total)}</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={() => setShowCheckout(true)}
                disabled={isLoading}
              >
                Proceder al Pago
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/products")}
              >
                Continuar Comprando
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;