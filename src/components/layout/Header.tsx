import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, Search, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-chocolate rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🍫</span>
            </div>
            <span className="text-xl font-bold bg-gradient-chocolate bg-clip-text text-transparent">
              TesorosChoco
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/products" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Catálogo
            </Link>
            <Link 
              to="/categories" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Categorías
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Nosotros
            </Link>
            <Link 
              to="/contact" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contacto
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hover:bg-accent/20">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="hover:bg-accent/20">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Lista de deseos</span>
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-accent/20"
              asChild
            >
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground"
                  >
                    {itemCount}
                  </Badge>
                )}
                <span className="sr-only">Carrito de compras</span>
              </Link>
            </Button>

            {/* User account */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/orders">Mis Órdenes</Link>
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-accent/20" asChild>
                  <Link to="/profile">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Mi cuenta</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button variant="premium" size="sm" asChild>
                  <Link to="/register">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;