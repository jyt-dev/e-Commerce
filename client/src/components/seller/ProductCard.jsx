import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { removeProduct } from "@/features/seller/productSlice.js";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

function ProductCard ({
    product
}){
    const [isDeleting, setIsDeleting] = useState(false);
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
      <Card className="overflow-hidden border-0 shadow-none rounded-none group cursor-pointer">
        <img
          src={product.images?.[0]}
          alt={product.name}
          width={400}
          height={256}
          loading="lazy"
          className="h-64 w-full object-contain"
        />

        {/* <CardHeader >
          <CardTitle>{product.name}</CardTitle>
        </CardHeader> */}

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
          <Button className="flex-1">Edit</Button>
          <Button onClick={handleDeleteProduct} variant="destructive" className="flex-1" disabled={isDeleting}>
            {isDeleting ? "Deleting...." : "Delete"}
          </Button>
        </CardFooter>
      </Card>
    );
}

export default memo(ProductCard);