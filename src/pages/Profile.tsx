import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";
import { userService } from "@/services/userService";
import { User, Edit, Package, LogOut } from "lucide-react";
import type { Order, UpdateUserRequest } from "@/types";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (!user) return;
    
    try {
      setIsLoadingOrders(true);
      const response = await orderService.getUserOrders(1, 20);
      setOrders(response.orders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      const updateData: UpdateUserRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      };
      
      const updatedUser = await userService.updateCurrentUserProfile(updateData);
      updateUser(updatedUser);
      setIsEditing(false);
      
      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada exitosamente.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Acceso Requerido</h1>
          <p className="text-muted-foreground mb-6">
            Debes iniciar sesión para ver tu perfil
          </p>
          <Button onClick={() => navigate("/login")}>
            Iniciar Sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y revisa tus pedidos
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Información Personal</TabsTrigger>
          <TabsTrigger value="orders">Mis Pedidos</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Información Personal</CardTitle>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          firstName: user?.firstName || "",
                          lastName: user?.lastName || "",
                          phone: user?.phone || "",
                          address: user?.address || "",
                        });
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                      {isUpdating ? "Guardando..." : "Guardar"}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled />
                    <p className="text-sm text-muted-foreground mt-1">
                      El email no se puede modificar
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre</Label>
                      <p className="font-medium">{user.firstName}</p>
                    </div>
                    <div>
                      <Label>Apellido</Label>
                      <p className="font-medium">{user.lastName}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <p className="font-medium">{user.phone || "No especificado"}</p>
                  </div>
                  <div>
                    <Label>Dirección</Label>
                    <p className="font-medium">{user.address || "No especificada"}</p>
                  </div>
                  <div>
                    <Label>Tipo de cuenta</Label>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>
                  <div>
                    <Label>Miembro desde</Label>
                    <p className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Mis Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-32"></div>
                          <div className="h-3 bg-muted rounded w-24"></div>
                        </div>
                        <div className="h-6 bg-muted rounded w-20"></div>
                      </div>
                      <div className="h-3 bg-muted rounded w-48"></div>
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No tienes pedidos aún</h3>
                  <p className="text-muted-foreground mb-6">
                    ¡Explora nuestros productos y haz tu primer pedido!
                  </p>
                  <Button onClick={() => navigate("/products")}>
                    Ver Productos
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const statusInfo = orderService.getOrderStatus(order.status);
                    return (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">Pedido #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total de productos:</span>
                            <span>{order.totalItems}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Método de pago:</span>
                            <span>{orderService.getPaymentMethodLabel(order.paymentMethod)}</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>{orderService.formatPrice(order.total)}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Productos:</h4>
                          <div className="space-y-1">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.productName} x{item.quantity}</span>
                                <span>{orderService.formatPrice(item.totalPrice)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Dirección de envío:</h4>
                          <p className="text-sm text-muted-foreground">
                            {order.shippingAddress.name}<br />
                            {order.shippingAddress.address}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.zipCode}<br />
                            Tel: {order.shippingAddress.phone}
                          </p>
                        </div>

                        {order.notes && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium mb-2">Notas:</h4>
                            <p className="text-sm text-muted-foreground">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;