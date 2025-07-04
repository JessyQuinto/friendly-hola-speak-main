import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import type { CreateOrderRequest } from "@/types";
import { toast } from "@/hooks/use-toast";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart || cart.items.length === 0) {
      toast({
        title: "Error",
        description: "No hay productos en el carrito",
        variant: "destructive",
      });
      return;
    }

    // Basic validation
    if (!shippingData.name || !shippingData.address || !shippingData.city || !shippingData.region || !shippingData.phone) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const orderData: CreateOrderRequest = {
        paymentMethod,
        shippingAddress: shippingData,
        notes: notes.trim() || undefined,
      };
      
      const order = await orderService.createOrder(orderData);
      
      // Clear cart after successful order
      await clearCart();
      
      toast({
        title: "¡Orden creada exitosamente!",
        description: `Tu orden #${order.id} ha sido procesada.`,
      });
      
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu orden. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Acceso Requerido</h1>
          <p className="text-muted-foreground mb-6">
            Debes iniciar sesión para proceder con la compra
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
          <h1 className="text-2xl font-bold mb-2">Carrito Vacío</h1>
          <p className="text-muted-foreground mb-6">
            Agrega productos a tu carrito antes de proceder al checkout
          </p>
          <Button onClick={() => navigate("/products")}>
            Explorar Productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/cart")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Carrito
      </Button>

      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Dirección de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre Completo *</Label>
                    <Input
                      id="name"
                      value={shippingData.name}
                      onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Departamento *</Label>
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
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Método de Pago</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notas Adicionales</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instrucciones especiales para la entrega..."
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-sm">
                        {orderService.formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.totalItems} productos)</span>
                    <span>{orderService.formatPrice(cart.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span className="text-muted-foreground">A calcular</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>{orderService.formatPrice(cart.total)}</span>
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? "Procesando..." : "Confirmar Pedido"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Al realizar el pedido, aceptas nuestros términos y condiciones.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;