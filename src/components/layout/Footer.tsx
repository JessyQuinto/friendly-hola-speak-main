import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-chocolate-dark text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
                <span className="text-chocolate-dark font-bold text-lg">🍫</span>
              </div>
              <span className="text-xl font-bold">TesorosChoco</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Chocolates artesanales colombianos de la más alta calidad. 
              Creamos experiencias únicas con sabores auténticos y tradición.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-gold-accent/20">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gold-accent/20">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gold-accent/20">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gold-accent">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/products" 
                  className="text-primary-foreground/80 hover:text-gold-accent transition-colors text-sm"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories" 
                  className="text-primary-foreground/80 hover:text-gold-accent transition-colors text-sm"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-primary-foreground/80 hover:text-gold-accent transition-colors text-sm"
                >
                  Nuestra Historia
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-primary-foreground/80 hover:text-gold-accent transition-colors text-sm"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gold-accent">Atención al Cliente</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/help" 
                  className="text-primary-foreground/80 hover:text-gold-accent transition-colors text-sm"
                >
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-primary-foreground/80 hover:text-gold-accent transition-colors text-sm"
                >
                  Envíos y Devoluciones
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-primary-foreground/80 hover:text-gold-accent transition-colors text-sm"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-primary-foreground/80 hover:text-gold-accent transition-colors text-sm"
                >
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gold-accent">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span>+57 300 123 4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span>info@tesoroschoco.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4" />
                <span>Bogotá, Colombia</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gold-accent">Newsletter</h4>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Tu email" 
                  className="bg-chocolate-medium border-gold-accent/30 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Button variant="premium" size="sm">
                  Suscribir
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gold-accent/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2025 TesorosChoco. Todos los derechos reservados. 
            Hecho con ❤️ para los amantes del chocolate.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;