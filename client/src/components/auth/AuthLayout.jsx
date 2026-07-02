import { Outlet } from "react-router-dom";



function AuthLayout() {
    return (
        <div className="flex min-screen w-full">
            <div className="hidden lg: flex items-center justify-center bg-black w-1/2 px-12">
                <h1 className="text-4xl font-extrabold tracking-tight">
                    Welcome
                </h1>
            </div>
            <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm: px-6 lg: px-8">
                <Outlet/>
            </div>
        </div>
    )
}

export default AuthLayout

