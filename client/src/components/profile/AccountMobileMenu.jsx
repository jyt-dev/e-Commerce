import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AccountSidebar, { navGroups } from './AccountSidebar';

export default function AccountMobileMenu() {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const activeLabel = navGroups
        .flatMap(g => g.items)
        .find(i => i.path === location.pathname)?.label || 'Account';

    return (
        <div className="md:hidden border-b border-gray-200 bg-gray-50 p-3">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full flex justify-between items-center rounded-none border-gray-300"
                    >
                        <div className="flex items-center gap-2">
                            <Menu className="h-4 w-4" />
                            <span>Account Menu</span>
                        </div>
                        <span className="text-muted-foreground text-xs font-normal">{activeLabel}</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Account Menu</SheetTitle>
                    </SheetHeader>
                    <AccountSidebar onNavigate={() => setOpen(false)} />
                </SheetContent>
            </Sheet>
        </div>
    );
}
