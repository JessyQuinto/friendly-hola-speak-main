import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, Calendar, CreditCard, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders(currentPage, 10);
      setOrders(response.orders);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las órdenes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, fetchOrders]);

  const getStatusBadge = (status: Order['status']) => {
    const statusInfo = orderService.getOrderStatus(status);
    return (
      <Badge variant="secondary" className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Mis Órdenes</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Mis Órdenes</h1>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No tienes órdenes aún</h2>
            <p className="text-muted-foreground mb-4">
              Cuando realices tu primera compra, aparecerá aquí
            </p>
            <Link to="/products">
              <Button>Explorar Productos</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Orden #{order.id}
                  </CardTitle>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(order.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    {orderService.getPaymentMethodLabel(order.paymentMethod)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {order.totalItems} {order.totalItems === 1 ? 'producto' : 'productos'}
                    </p>
                    <p className="text-lg font-semibold">
                      {orderService.formatPrice(order.total)}
                    </p>
                  </div>
                  <Link to={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
