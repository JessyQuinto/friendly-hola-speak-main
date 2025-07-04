import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { orderService } from "@/services/orderService";
import { CheckCircle, Package, Truck, MapPin, CreditCard, Phone, Home } from "lucide-react";
import type { Order } from "@/types";

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const orderData = await orderService.getOrder(parseInt(id));
      setOrder(orderData);
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Orden no encontrada</h1>
          <p className="text-muted-foreground mb-6">
            La orden que buscas no existe o no tienes permisos para verla.
          </p>
          <Button onClick={() => navigate("/")}>
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = orderService.getOrderStatus(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="text-center py-8">
          <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-lg text-muted-foreground">
            Gracias por tu compra. Tu orden ha sido procesada exitosamente.
          </p>
        </div>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Orden #{order.id}</CardTitle>
              <Badge className={statusInfo.color}>
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Creada el {new Date(order.createdAt).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Productos Ordenados
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <img
                      src={item.product?.image || '/placeholder.svg'}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {item.quantity} × {orderService.formatPrice(item.unitPrice)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {orderService.formatPrice(item.totalPrice)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Total */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{orderService.formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{orderService.formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Información de Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Home className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.region}
                  {order.shippingAddress.zipCode && ` ${order.shippingAddress.zipCode}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{order.shippingAddress.phone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Método de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{orderService.getPaymentMethodLabel(order.paymentMethod)}</p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>¿Qué sigue?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <div>
                <p className="font-medium">Procesamiento</p>
                <p className="text-sm text-muted-foreground">
                  Estamos preparando tu pedido para el envío.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-muted-foreground">2</span>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Envío</p>
                <p className="text-sm text-muted-foreground">
                  Te notificaremos cuando tu pedido sea enviado.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-muted-foreground">3</span>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Entrega</p>
                <p className="text-sm text-muted-foreground">
                  Recibirás tu pedido en la dirección especificada.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => navigate(`/orders/${order.id}`)}
            className="flex-1"
          >
            Ver Detalles de la Orden
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/products")}
            className="flex-1"
          >
            Seguir Comprando
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;