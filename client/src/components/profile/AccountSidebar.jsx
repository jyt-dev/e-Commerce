import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/features/auth/authThunk';
import { toast } from 'sonner';
import { Package, User, MapPin, Star, Store, CreditCard, LogOut, ChevronRight } from 'lucide-react';

export const navGroups = [
    {
        label: 'MY ORDERS',
        items: [
            { id: 'orders', label: 'Order History', icon: Package, path: '/account/orders' },
        ],
    },
    {
        label: 'ACCOUNT SETTINGS',
        items: [
            { id: 'profile', label: 'Profile Information', icon: User, path: '/account/profile' },
            { id: 'addresses', label: 'Manage Addresses', icon: MapPin, path: '/account/addresses' },
            { id: 'reviews', label: 'Reviews & Ratings', icon: Star, path: '/account/reviews' },
            { id: 'seller', label: 'Become a Seller', icon: Store, path: '/account/seller' },
        ],
    },
    {
        label: 'PAYMENTS',
        items: [
            { id: 'payments', label: 'Saved Payments', icon: CreditCard, path: '/account/payments' },
        ],
    },
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
        <div className="flex flex-col">
            {/* User header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg shrink-0">
                    {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
                </div>
                <div className="leading-tight min-w-0">
                    <p className="text-xs text-gray-500">Hello,</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.fullName || user?.username || 'User'}
                    </p>
                </div>
            </div>

            {/* Nav groups */}
            {navGroups.map((group) => (
                <div key={group.label}>
                    <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                        <span className="text-xs font-bold text-gray-400 tracking-wider">{group.label}</span>
                    </div>
                    {group.items.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item.path)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors border-l-2 ${
                                    isActive
                                        ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium'
                                        : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <span>{item.label}</span>
                                {isActive && <ChevronRight className="h-4 w-4 text-blue-500" />}
                            </button>
                        );
                    })}
                </div>
            ))}

            {/* Logout */}
            <div className="mt-auto border-t border-gray-200 pt-2 mt-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-l-2 border-transparent"
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Logout
                </button>
            </div>
        </div>
    );
}
