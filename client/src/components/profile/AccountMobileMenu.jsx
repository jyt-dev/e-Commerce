import { useLocation, useNavigate } from 'react-router-dom';
import { navItems } from './AccountSidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AccountMobileMenu() {
    const location = useLocation();
    const navigate = useNavigate();

    const allItems = navItems;

    return (
        <div className="md:hidden w-full bg-white border-b border-gray-100 shadow-sm sticky top-14 z-40 p-4">
            <Select 
                value={location.pathname} 
                onValueChange={(val) => navigate(val)}
            >
                <SelectTrigger className="w-full bg-gray-50 h-12 text-base font-semibold text-gray-800 rounded-xl border border-gray-200">
                    <SelectValue placeholder="Navigate to..." />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-lg border-gray-100">
                    {allItems.map(item => (
                        <SelectItem 
                            key={item.id} 
                            value={item.path} 
                            className="py-3 px-4 text-sm font-medium focus:bg-teal-50 focus:text-teal-900 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                {item.label}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
