import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

function ShoppingLayout() {
    const location = useLocation();
    const showSidebar = location.pathname === "/products"
    return ( 
        <div className="flex flex-col min-h-screen bg-white">
            <Header/>
            <div className="flex flex-1 w-full">
                {showSidebar && <Sidebar/>}
                <main className="flex flex-1 flex-col w-full">
                    <Outlet/>
                </main>
            </div>
            <Footer/>
        </div>
     );
}

export default ShoppingLayout;