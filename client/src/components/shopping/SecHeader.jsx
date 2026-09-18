import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const headerNavButtons = [
    {
        id: "appliances",
        label: "Appliances",
        path: "shop/"
    },
     {
        id: "grocery",
        label: "Grocery",
        path: "shop/"
    },
     {
        id: "kids",
        label: "Kids",
        path: "shop/"
    },
     {
        id: "men",
        label: "Men",
        path: "shop/"
    },
     {
        id: "women",
        label: "Women",
        path: "shop/"
    },
     {
        id: "electronics",
        label: "Electronics",
        path: "shop/"
    },
    {
        id: "sports",
        label: "Sports, Books & More",
        path: "shop/"
    },
    {
        id: "home",
        label: "Home & Furniture",
        path: "shop/"
    },
    {
        id: "health",
        label: "Health & Personal Care",
        path: "shop/"
    }
]

function SecHeader() {

    const navigate = useNavigate();
    return (
      <div className="hidden lg:flex w-full justify-around items-center px-4 border-b-2 border-gray-200 py-0.6 text-[13px] font-bold  font-serif bg-teal-800">
        {headerNavButtons.map((btn) => (
          <Button
            key={btn.id}
            variant="ghost"
            className="text-white hover:bg-transparent cursor-pointer"
            onClick={() => navigate(btn.path)}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    );
}

export default SecHeader;