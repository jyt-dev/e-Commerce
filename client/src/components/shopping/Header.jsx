
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import synxshopLogo  from "../../assets/synxshop-logo-white.svg"
import { Input } from "../ui/input";
import { Search, Menu, CircleUserRound, Heart, Store, ShoppingCart, Package, Headset, Gift, MapPinned, LogOut } from "lucide-react";
import { IconShoppingCart } from '@tabler/icons-react';
import { Button } from "../ui/button";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/features/auth/authThunk";
import { getProducts } from "@/features/shopping/productSlice";
import { fetchCart } from "@/features/shopping/cartThunk";
import SecHeader from "./SecHeader";

function Header() {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
    const {isAuthenticated, user} = useSelector((state) => state.auth);
    const {cartData} = useSelector((state) => state.cart);
    const cartCount = cartData?.items?.length || 0;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
        }
    }, [dispatch, isAuthenticated]);

    function handleLogout(){
      dispatch(logoutUser()).then(() => {
      navigate("/auth/login");
      setIsMobileMenuOpen(false);
    });
    }

    function handleMobileNav(path) {
        setIsMobileMenuOpen(false);
        if(path && path !== "#") navigate(path);
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
            <div className="flex items-center justify-between w-full md:w-auto relative">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="block md:hidden text-white hover:text-blue-200 cursor-pointer" aria-label="Open Menu">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] max-w-[320px] bg-white p-0 shadow-2xl flex flex-col h-full border-r-0">
                  <SheetHeader className="p-6 bg-linear-to-r from-teal-900 to-teal-800 text-white shadow-md rounded-br-3xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <SheetTitle className="text-left text-white font-bold text-2xl tracking-tight relative z-10">SynXShop</SheetTitle>
                    {isAuthenticated && user && (
                      <p className="text-left text-teal-100 text-sm mt-1 relative z-10 truncate">Hello, {user?.fullName || user?.username || 'User'}!</p>
                    )}
                  </SheetHeader>
                  <div className="flex flex-col p-4 gap-1 flex-grow overflow-y-auto">
                    {[
                      { label: "Profile", path: "/account/profile" },
                      { label: "Orders", path: "/account/orders" },
                      { label: "Wishlist", path: "#" },
                      { label: "Rewards", path: "#" },
                      { label: "Addresses", path: "/account/addresses" },
                      { label: "Become a Seller", path: "/account/seller" },
                      { label: "Customer Support", path: "#" },
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center p-3 cursor-pointer hover:bg-teal-50 rounded-lg transition-colors" 
                        onClick={() => handleMobileNav(item.path)}
                      >
                        <span className="font-medium text-gray-800">{item.label}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    {isAuthenticated ? (
                      <Button variant="destructive" className="w-full flex items-center justify-center gap-2 rounded-xl h-12 hover:scale-[1.02] transition-transform" onClick={handleLogout}>
                        <LogOut className="w-5 h-5" />
                        <span className="font-bold">Logout</span>
                      </Button>
                    ) : (
                      <Button className="w-full flex items-center justify-center gap-2 rounded-xl h-12 hover:scale-[1.02] transition-transform shadow-md" onClick={() => handleMobileNav("/auth/login")}>
                        <CircleUserRound className="w-5 h-5" />
                        <span className="font-bold">Sign In / Sign Up</span>
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              <div className="cursor-pointer absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0" onClick={() => navigate("/")}>
                <img
                  src={synxshopLogo}
                  className="h-6 sm:h-7 md:h-8 w-auto transition-all"
                  alt="SynXShop"
                />
              </div>
              <div className="md:hidden flex items-center gap-1">
                <Button variant="ghost" size="icon" className="text-white hover:text-blue-200 hover:bg-transparent cursor-pointer">
                  <Heart className="size-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-blue-200 hover:bg-transparent cursor-pointer" onClick={() => navigate("/cart")}>
                  <div className="relative inline-flex">
                    <ShoppingCart className="size-5" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-2.5 bg-yellow-400 text-gray-900 text-[10px] font-bold h-[16px] min-w-[16px] px-1 flex items-center justify-center rounded-full shadow-sm border-[1.5px] border-[#003B31]">
                            {cartCount}
                        </span>
                    )}
                  </div>
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
                onClick={() => navigate("/cart")}
              >
                <div className="relative inline-flex">
                  <IconShoppingCart stroke={2} />
                  {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 bg-yellow-400 text-gray-900 text-[10px] font-bold h-[16px] min-w-[16px] px-1 flex items-center justify-center rounded-full shadow-sm border-[1.5px] border-[#003B31]">
                          {cartCount}
                      </span>
                  )}
                </div>
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
                    <DropdownMenuItem onClick={() => navigate("/account/profile")} className="cursor-pointer">
                      <CircleUserRound />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/account/orders")} className="cursor-pointer">
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
                    <DropdownMenuItem onClick={() => navigate("/account/addresses")} className="cursor-pointer">
                      <MapPinned />
                      Addresses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/account/seller")} className="cursor-pointer">
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
        {location.pathname === '/' && <SecHeader />}
      </div>
    );
}

export default Header;