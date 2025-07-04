import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-chocolate.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-chocolate-dark/40 backdrop-blur-[1px]" />
        </div>
        
        <div className="relative z-10 text-center text-primary-foreground max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-gold bg-clip-text text-transparent">
            TesorosChoco
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 font-light">
            Chocolates artesanales colombianos de la más alta calidad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Explorar Catálogo
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-chocolate-dark">
              Nuestra Historia
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Productos Destacados
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Descubre nuestra selección especial de chocolates artesanales, 
            elaborados con los mejores granos de cacao colombiano.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-card rounded-lg p-6 shadow-elegant hover:shadow-premium transition-shadow">
                <div className="w-full h-48 bg-cream-soft rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl">🍫</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Chocolate Premium {item}</h3>
                <p className="text-muted-foreground mb-4">Delicioso chocolate artesanal de origen único</p>
                <div className="text-2xl font-bold text-accent mb-4">$15.000</div>
                <Button className="w-full">Agregar al Carrito</Button>
              </div>
            ))}
          </div>
          
          <Button variant="outline" size="lg">
            Ver Todos los Productos
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
