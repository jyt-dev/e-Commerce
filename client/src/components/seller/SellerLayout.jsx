import { Outlet } from "react-router-dom";
import Header from "./Header.jsx"
import Sidebar from "./Sidebar.jsx"
import { useState } from "react";

function SellerLayout() {
    const [openSidebar, setOpenSidebar] = useState(false);

    return ( 
        <div className="flex h-screen overflow-hidden w-full">
        {/* selller sidebar */}
        <Sidebar open={openSidebar} setOpen={setOpenSidebar}/>
        <div className="flex flex-1 flex-col">
            {/* seller header */}
            <Header setOpen={setOpenSidebar}/>
            <main className="flex-1 flex bg-muted/40 p-2 md:p-3 overflow-y-auto">
                <Outlet/>
            </main>
        </div>
     
    </div>
    );
}

export default SellerLayout;