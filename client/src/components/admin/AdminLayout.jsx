import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar.jsx"
import Header from "./Header.jsx"

function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full">
        {/* admin sidebar */}
        <Sidebar/>
        <div className="flex flex-1 flex-col">
            {/* admin header */}
            <Header/>
            <main className="flex-1 flex bg-muted/40 p-4 md:p-6">
                <Outlet/>
            </main>
        </div>
     
    </div>
  )
}

export default AdminLayout
