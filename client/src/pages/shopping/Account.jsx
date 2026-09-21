import { Outlet } from 'react-router-dom';
import AccountSidebar from '@/components/profile/AccountSidebar';
import AccountMobileMenu from '@/components/profile/AccountMobileMenu';

function Account() {
    return (
        <div className="flex-1 w-full min-h-screen bg-gray-50">
            <div className="w-full max-w-6xl mx-auto px-4 py-6 md:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-0 border border-gray-200">
                    {/* Mobile menu trigger bar */}
                    <AccountMobileMenu />

                    {/* Desktop sidebar */}
                    <div className="hidden md:block w-60 shrink-0 border-r border-gray-200 bg-white">
                        <AccountSidebar />
                    </div>

                    {/* Page content via nested routes */}
                    <div className="flex-1 min-w-0 bg-white p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;