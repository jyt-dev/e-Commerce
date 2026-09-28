import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

function CardHome({ src, className }) {
    return (
      <Card className="group cursor-pointer overflow-hidden rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-300 h-full">
        <div className="relative overflow-hidden bg-gray-50 h-full">
          <img
            src={src}
            alt="Product image"
            loading="lazy"
            decoding="async"
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${className ? className : 'h-48'}`}
          />
          {/* Quick action button overlay on hover */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button variant="secondary" className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </div>
        </div>
      </Card>
    );
}

export default CardHome;