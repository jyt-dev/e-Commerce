import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { memo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { removeProduct } from "@/features/seller/productSlice.js";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

function ProductCard ({
    product
}){
    const [isDeleting, setIsDeleting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (!product.images || product.images.length <= 1 || !isHovered) return;
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % product.images.length);
        }, 1500); // slightly faster (1.5s) on hover for better UX
        return () => clearInterval(interval);
    }, [product.images, isHovered]);
    const dispatch = useDispatch();
    function handleDeleteProduct(){
        const confirmed = window.confirm(`Delete ${product.name}? This can't be undone`);
        if(!confirmed) return;

        setIsDeleting(true);

        dispatch(removeProduct(product._id)).then((res) => {
            if(res.meta.requestStatus === "fulfilled"){
              toast.success("Product deleted successfully")
            }
            else{
              toast.error(res.payload || "Failed to delete product")
            }
        })

    }

    return (
      <Card 
        className="overflow-hidden border-0 shadow-none rounded-none group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
            setIsHovered(false);
            setCurrentImageIndex(0);
        }}
      >
        <div className="relative h-64 w-full overflow-hidden bg-gray-50">
          <div 
            className="flex h-full w-full transition-transform duration-500 ease-in-out" 
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name} - ${i + 1}`}
                className="h-full w-full flex-shrink-0 object-contain"
                loading="lazy"
              />
            ))}
          </div>
          {product.images?.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
              {product.images.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-4 bg-gray-800' : 'w-1.5 bg-gray-400'}`}></div>
              ))}
            </div>
          )}
        </div>

        <CardContent className="space-y-1">
          <CardTitle>{product.name}</CardTitle>
          <p className="mt-0">{product.description}</p>

          <div className="flex justify-between">
            <span className="font-semibold">₹{product.price}</span>
            <span>Stock: {product.stock}</span>
          </div>
          <p className="text-sm">Category: {product.category}</p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">Edit</Button>
          <Button onClick={handleDeleteProduct} variant="destructive" className="flex-1" disabled={isDeleting}>
            {isDeleting ? "Deleting...." : "Delete"}
          </Button>
        </CardFooter>
      </Card>
    );
}

export default memo(ProductCard);