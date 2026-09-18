import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logofont  from "../../assets/logofont.svg"
import { Input } from "../ui/input";
import { Search, Menu, CircleUserRound, Heart, Store, ShoppingCart, Package, Headset, Gift, MapPinned, LogOut } from "lucide-react";
import { IconShoppingCart } from '@tabler/icons-react';
import { Button } from "../ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/features/auth/authThunk";
import { getProducts } from "@/features/shopping/productSlice";
import SecHeader from "./SecHeader";

function Header() {
    const [isHovered, setIsHovered] = useState(false);
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
    const {isAuthenticated, user} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleLogout(){
      dispatch(logoutUser()).then(() => {
      navigate("/auth/login");
    });
    }

    function handleSearch(e){
      if(e.key !== "Enter") return;
      const trimmed = searchTerm.trim();
      const params = new URLSearchParams();
      if(trimmed) params.set("query", trimmed);
      navigate(`/products?${params.toString()}`);
      dispatch(getProducts(trimmed ? { query: trimmed } : {}));
    }

    return (
      <div className="">
        <header className="sticky top-0 z-50  border-solid border-gray-200 bg-teal-950 ">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 md:py-2.5 gap-3 md:gap-4">
            {/* Mobile top bar Menu, logo, actions */}
            <div className="flex items-center justify-between w-full md:w-auto">
              <button className="block md:hidden text-gray-700 hover:text-blue-500 aria-label='Open Menu'">
                <Menu className="h-6 w-6" />
              </button>
              {/* <div className="hidden md:block bg-amber-300 px-2 py-0 rounded-md">
              <img
                src={logofont}
                class="h-8 w-auto "
                alt="Company Logo"
                width={120}
                height={40}
              />
            </div> */}
              <div className="md:hidden flex items-center gap-1">
                {/* Added variant="ghost" size="icon" and a custom class h-12 w-12 to fit the big icons */}
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <Heart className="size-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <ShoppingCart className="size-5" />
                </Button>
              </div>
            </div>
            {/* ROW 2: SEARCH BAR (Below on Mobile, Flexible Center on Desktop) */}
            <div className="">
              <div className="relative w-full ">
                <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-gray-400" />
                <Input
                  className="w-full lg:w-xs border-solid border-gray-300 border-3 pl-8 py-5 md:py-3 rounded-full bg-white text-sm"
                  type="search"
                  placeholder="Search for Products, Brands and More "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
            </div>
            {/* desktop only navigation */}
            <div className="hidden md:flex md:items-center md:justify-between md:gap-0 text-sm font-medium text-gray-700">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-transparent cursor-pointer"
              >
                <Heart className="size-4" />
              </Button>
              <Button
                variant="ghost"
                className="text-white text-sm font-normal gap-1.5 hover:bg-transparent cursor-pointer"
              >
                {/* <ShoppingCart className="size-4" /> */}
                <IconShoppingCart stroke={2} />
              </Button>
              <div>
                <DropdownMenu open={isHovered} onOpenChange={setIsHovered}>
                  <DropdownMenuTrigger
                    asChild
                    onMouseEnter={() => setIsHovered(true)}
                  >
                    <Button
                      variant="ghost"
                      className="text-sm font-normal text-white hover:bg-transparent hover:text-current data-[state=open]:bg-transparent data-[state=open]:text-current focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
                    >
                      <CircleUserRound />
                      {/* Profile */}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="font-normal w-42 gap-4"
                    align="end"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <DropdownMenuItem>
                      <CircleUserRound />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Package />
                      Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Heart />
                      Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Gift />
                      Rewards
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MapPinned />
                      Addresses
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Store />
                      Become a Seller
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Headset />
                      Customer Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuItem onClick={handleLogout} >
                    <LogOut />
                    Logout
                  </DropdownMenuItem> */}
                    <DropdownMenuItem>
                      {isAuthenticated ? (
                        <Button 
                          onClick={handleLogout}
                          variant="ghost"
                          className="text-blue-800 text-[19px] font-normal  hover:bg-transparent cursor-pointer"
                        >
                          <LogOut />
                          Logout
                        </Button>
                      ) : (
                        <Button
                          onClick={() => navigate("/auth/login")}
                          variant="ghost"
                          className="text-blue-800 text-[19px] font-normal  hover:bg-transparent cursor-pointer"
                        >
                          Sign Up
                        </Button>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>
        <SecHeader />
      </div>
    );
}

export default Header;