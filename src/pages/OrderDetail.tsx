import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { orderService } from "@/services/orderService";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard, 
  Phone, 
  Home,
  Calendar,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import type { Order } from "@/types";
import { toast } from "@/hooks/use-toast";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

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

  const handleCancelOrder = async () => {
    if (!order || !id) return;
    
    setCancelling(true);
    try {
      await orderService.cancelOrder(parseInt(id));
      await loadOrder(); // Reload to get updated status
      toast({
        title: "Orden cancelada",
        description: "Tu orden ha sido cancelada exitosamente.",
      });
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: "No se pudo cancelar la orden. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-12 bg-muted rounded w-1/2"></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
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
          <Button onClick={() => navigate("/profile")}>
            Ver Mis Órdenes
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = orderService.getOrderStatus(order.status);
  const canCancel = ['Pending', 'Processing'].includes(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        {/* Order Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold">Orden #{order.id}</h1>
              <p className="text-muted-foreground">
                Creada el {new Date(order.createdAt).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={statusInfo.color} variant="secondary">
                {statusInfo.label}
              </Badge>
              {canCancel && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                >
                  {cancelling ? "Cancelando..." : "Cancelar Orden"}
                </Button>
              )}
            </div>
          </div>

          {/* Status Alert */}
          {order.status === 'Cancelled' && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Esta orden ha sido cancelada. Si tienes preguntas, contacta nuestro servicio al cliente.
              </AlertDescription>
            </Alert>
          )}

          {order.status === 'Delivered' && (
            <Alert className="mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                ¡Tu orden ha sido entregada exitosamente! Esperamos que disfrutes tus productos.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Productos ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex items-center gap-4">
                        <img
                          src={item.product?.image || '/placeholder.svg'}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.productName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Cantidad: {item.quantity}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Precio unitario: {orderService.formatPrice(item.unitPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {orderService.formatPrice(item.totalPrice)}
                          </p>
                        </div>
                      </div>
                      {index < order.items.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Historial de la Orden
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-medium">Orden creada</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {order.status !== 'Pending' && (
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        ['Processing', 'Shipped', 'Delivered'].includes(order.status) 
                          ? 'bg-primary' 
                          : 'bg-muted'
                      }`}></div>
                      <div>
                        <p className="font-medium">Orden en procesamiento</p>
                        <p className="text-sm text-muted-foreground">
                          Tu orden está siendo preparada
                        </p>
                      </div>
                    </div>
                  )}

                  {['Shipped', 'Delivered'].includes(order.status) && (
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        ['Shipped', 'Delivered'].includes(order.status) 
                          ? 'bg-primary' 
                          : 'bg-muted'
                      }`}></div>
                      <div>
                        <p className="font-medium">Orden enviada</p>
                        <p className="text-sm text-muted-foreground">
                          Tu pedido está en camino
                        </p>
                      </div>
                    </div>
                  )}

                  {order.status === 'Delivered' && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <p className="font-medium text-green-700">Orden entregada</p>
                        <p className="text-sm text-muted-foreground">
                          Tu pedido ha sido entregado exitosamente
                        </p>
                      </div>
                    </div>
                  )}

                  {order.status === 'Cancelled' && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                      <div>
                        <p className="font-medium text-red-700">Orden cancelada</p>
                        <p className="text-sm text-muted-foreground">
                          Esta orden ha sido cancelada
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Total */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{orderService.formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>$0</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
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
                  Dirección de Envío
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

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notas Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;