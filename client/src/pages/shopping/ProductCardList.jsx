import { Bookmark, Plus, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/shopping/cartThunk";
import { toast } from "sonner";

function ProductCardList({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="group relative border border-gray-100 rounded-md hover:shadow-xl transition-all duration-300 bg-white overflow-hidden flex flex-col h-full">
      <div 
        className="cursor-pointer flex flex-col h-full"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full bg-[#f6f6f6] overflow-hidden p-6 flex items-center justify-center">
          
          {/* Bookmark Icon */}
          <button 
            className="absolute top-4 right-4 text-gray-400 hover:text-black z-10 transition-colors"
            onClick={(e) => { 
              e.stopPropagation(); 
              // TODO: add bookmark logic
            }}
          >
            <Bookmark size={20} strokeWidth={1.5} />
          </button>

          {/* Product Image */}
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          />

          {/* Plus Button */}
          <button 
            className="absolute bottom-4 right-4 bg-white p-2 shadow-sm border border-gray-100 rounded-full text-gray-600 hover:text-black z-10 transition-all hover:shadow-md"
            onClick={(e) => { 
              e.stopPropagation(); 
              dispatch(addToCart({ productId: product._id, quantity: 1 }))
                .unwrap()
                .then(() => toast.success("Added to cart"))
                .catch((err) => toast.error(err?.error || err?.message || "Failed to add to cart"));
            }}
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Details Container */}
        <div className="flex flex-col flex-grow py-4 px-4 bg-white">
          <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-1 mb-1">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-grow leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-0.5 mt-auto text-gray-900">
            <IndianRupee size={15} strokeWidth={2.5} />
            <span className="text-[16px] font-bold tracking-tight">
              {product.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCardList;