import { IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProductCardList({ product }) {
  const navigate = useNavigate();
  return (
    <div className="group">

      <div className="rounded-none gap-0.5 border-none shadow-none hover:shadow-sm cursor-pointer transition-all duration-200"
        onClick={() => navigate(`/product/${product._id}`)}
      >

        <img
          src={product.images?.[0]}
          alt={product.name}
          width={400}
          height={256}
          className="w-full h-58 bg-gray-50 object-cover "
        />

        <div className="flex flex-col gap-0 px-2.5 pt-2.5">

          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {product.name}
          </h3>

          <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
            {product.description}
          </p>

        </div>

        <p className="flex items-center gap-0.5 px-2.5 text-sm font-semibold text-gray-900">
          <IndianRupee size={13} strokeWidth={2.5} />
          {product.price}
        </p>

      </div>

    </div>
  );
}


export default ProductCardList;