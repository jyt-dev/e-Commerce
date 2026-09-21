import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/features/auth/authThunk';
import ProfileDetails from './ProfileDetails';
import AddressManager from './AddressManager';
import OrderHistory from './OrderHistory';
import BecomeSeller from './BecomeSeller';
import { User, MapPin, Package, CreditCard, Star, Store, LogOut, Menu, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const navGroups = [
    {
        label: 'MY ORDERS',
        items: [
            { id: 'orders', label: 'Order History', icon: Package },
        ],
    },
    {
        label: 'ACCOUNT SETTINGS',
        items: [
            { id: 'profile', label: 'Profile Information', icon: User },
            { id: 'addresses', label: 'Manage Addresses', icon: MapPin },
            { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
            { id: 'seller', label: 'Become a Seller', icon: Store },
        ],
    },
    {
        label: 'PAYMENTS',
        items: [
            { id: 'payments', label: 'Saved Payments', icon: CreditCard },
        ],
    },
];

export default function AccountTabs() {
    const [activeTab, setActiveTab] = useState('profile');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            toast.success("Logged out successfully");
            navigate('/auth/login');
        } catch (error) {
            toast.error("Failed to log out");
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileDetails />;
            case 'addresses': return <AddressManager />;
            case 'orders': return <OrderHistory />;
            case 'seller': return <BecomeSeller />;
            case 'payments':
                return (
                    <Card className="rounded-none border-0 shadow-none">
                        <CardContent className="p-8 text-center text-muted-foreground">
                            Payments feature coming soon.
                        </CardContent>
                    </Card>
                );
            case 'reviews':
                return (
                    <Card className="rounded-none border-0 shadow-none">
                        <CardContent className="p-8 text-center text-muted-foreground">
                            Reviews and Ratings feature coming soon.
                        </CardContent>
                    </Card>
                );
            default: return <ProfileDetails />;
        }
    };

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col">
            {/* User header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg shrink-0">
                    {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
                </div>
                <div className="leading-tight">
                    <p className="text-xs text-gray-500">Hello,</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName || user?.username || 'User'}</p>
                </div>
            </div>

            {/* Nav groups */}
            {navGroups.map((group) => (
                <div key={group.label}>
                    <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                        <span className="text-xs font-bold text-gray-400 tracking-wider">{group.label}</span>
                    </div>
                    {group.items.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                if (isMobile) setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors border-l-2 ${
                                activeTab === item.id
                                    ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium'
                                    : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <span>{item.label}</span>
                            {activeTab === item.id && <ChevronRight className="h-4 w-4 text-blue-500" />}
                        </button>
                    ))}
                </div>
            ))}

            {/* Logout */}
            <div className="mt-auto border-t border-gray-200 pt-2">
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

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6 md:px-6 lg:px-8">
            {/* Mobile Menu Button */}
            <div className="md:hidden mb-3">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full flex justify-between items-center rounded-none border-gray-300">
                            <div className="flex items-center gap-2">
                                <Menu className="h-4 w-4" />
                                <span>Account Menu</span>
                            </div>
                            <span className="text-muted-foreground text-xs font-normal">
                                {navGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label}
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Account Menu</SheetTitle>
                        </SheetHeader>
                        <SidebarContent isMobile />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop layout */}
            <div className="flex flex-col md:flex-row gap-0 border border-gray-200">
                {/* Sidebar */}
                <div className="hidden md:block w-60 shrink-0 border-r border-gray-200 bg-white">
                    <SidebarContent />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0 bg-white p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
