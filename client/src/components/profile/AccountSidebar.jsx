import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/features/auth/authThunk';
import { toast } from 'sonner';

export const navItems = [
    { id: 'profile', label: 'Personal Information', path: '/account/profile' },
    { id: 'addresses', label: 'Address', path: '/account/addresses' },
    { id: 'wishlist', label: 'Wishlist', path: '/account/wishlist' },
    { id: 'orders', label: 'My Orders', path: '/account/orders' },
    { id: 'reviews', label: 'Reviews & Ratings', path: '/account/reviews' },
    { id: 'seller', label: 'Become a Seller', path: '/account/seller' },
    { id: 'payments', label: 'Saved Payments', path: '/account/payments' },
];

export default function AccountSidebar({ onNavigate }) {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            toast.success("Logged out successfully");
            navigate('/auth/login');
        } catch {
            toast.error("Failed to log out");
        }
    };

    const handleNav = (path) => {
        navigate(path);
        onNavigate?.();
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Main Sidebar Box */}
            <div className="flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden">
                {/* User header */}
                <div className="flex items-center gap-3 p-5 border-b border-gray-100">
                    <div className="h-10 w-10 bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-lg shrink-0 rounded-full">
                        {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
                    </div>
                    <div className="leading-tight min-w-0">
                        <p className="text-xs text-gray-500">Hello,</p>
                        <p className="text-[14px] font-semibold text-gray-900 truncate mt-0.5">
                            {user?.fullName || user?.username || 'User'}
                        </p>
                    </div>
                </div>

                {/* Nav Links */}
                <div className="flex flex-col py-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item.path)}
                                className={`w-full flex items-center px-5 py-2.5 text-[14px] transition-colors ${
                                    isActive
                                        ? 'bg-blue-50/50 text-blue-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-5 py-2.5 text-[14px] text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Need Help Box */}
            <div className="flex flex-col items-center text-center bg-white border border-gray-200 rounded-sm p-6">
                <div className="h-12 w-12 bg-gray-100 rounded-full mb-3 flex items-center justify-center text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <h4 className="text-[15px] font-semibold text-gray-900 mb-1">Need Help?</h4>
                <p className="text-[13px] text-gray-500">
                    Have questions or concerns regarding your account?
                </p>
            </div>
        </div>
    );
}
