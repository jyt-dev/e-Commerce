import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

const clothCategories = [
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
  { id: "accessories", label: "Accessories" },
  { id: "footwear", label: "Footwear" },
  { id: "electronics", label: "Electronics" },
];

function Sidebar({ className }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentCategory = searchParams.get("category");

    const handleCategoryChange = (categoryId) => {
        if (currentCategory === categoryId) {
            searchParams.delete("category");
        } else {
            searchParams.set("category", categoryId);
        }
        searchParams.set("page", "1");
        setSearchParams(searchParams);
    };

    return (
        <div className={cn("flex flex-col border-r border-gray-200 p-6 bg-white", className)}>
            <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">Filter</h3>
            
            <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Category</h4>
                {clothCategories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
                            checked={currentCategory === cat.id}
                            onChange={() => handleCategoryChange(cat.id)}
                        />
                        <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                            {cat.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;