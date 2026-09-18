import { Box, Handbag, ChartSpline, Settings, Truck, MessageSquareMore, CircleQuestionMark} from 'lucide-react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
// import logoPng from "../../assets/logo.png"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const sidebarMenuItems = [
  {
    groupLabel: "Main Menu",
    items: [
      {
        id: "overview",
        label: "Overview",
        path: "/seller/dashboard",
        icon: <LayoutGrid />,
      },
      {
        id: "analytics",
        label: "Analytics",
        path: "/seller/analytics",
        icon: <ChartSpline />,
      },
      {
        id: "products",
        label: "Products",
        path: "/seller/products",
        icon: <Box />,
      },
      {
        id: "orders",
        label: "Orders",
        path: "/seller/orders",
        icon: <Handbag />,
      },
      {
        id: "shipment",
        label: "Shipment",
        path: "/seller/shipment",
        icon: <Truck />,
      },
    ],
  },
  {
    groupLabel: "Settings",
    items: [
       {
        id: "setting",
        label: "Setting",
        path: "/seller/setting",
        icon: <Settings />,
      },
      {
        id: "feedback",
        label: "Feedback",
        path: "/seller/feedback",
        icon: <MessageSquareMore />,
      },
      {
        id: "help",
        label: "Help & Support",
        path: "/seller/help",
        icon: <CircleQuestionMark />,
      },
    ],
  },
];


function MenuItems({ setOpen }) {
    const navigate = useNavigate();
    
    return (
        <nav className='mt-5 flex flex-col gap-6'>
          {sidebarMenuItems.map((group) => (
            <div key={group.groupLabel} className="flex flex-col gap-2">
                {/* Section Header */}
                <h3 className="px-1 text-xs font-semibold  tracking-wider text-muted-foreground/70">
                    {group.groupLabel}
                </h3>
                
                {/* Section Items */}
                <div className="flex flex-col gap-1">
                    {group.items.map((menuItem) => (
                        <div
                            className='flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-muted-foreground hover:bg-green-300 hover:text-foreground text-[14px] transition-colors'
                            key={menuItem.id}
                            onClick={() => {
                                navigate(menuItem.path);
                                if (setOpen) setOpen(false);
                            }}
                        >
                            {menuItem.icon}
                            <span>{menuItem.label}</span>
                        </div>
                    ))}
                </div>
            </div>
          ))}
        </nav>
    );
}


function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  return (
    <Fragment>
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-52 p-0">
            {" "}
            {/* p-0 gives you full control of padding inside */}
            <div className="flex flex-col h-full">
              <SheetHeader className="border-b">
                {/* The asChild prop stops the duplicate nested heading tags */}
                <SheetTitle asChild className="flex gap-2 mt-5 mb-5">
                  <h1 className="text-xl font-bold">ShopGram</h1>
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 px-6 py-4 overflow-y-auto">
                <h3>Menu</h3>
                <MenuItems setOpen={setOpen} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <aside className="hidden w-48 h-full shrink-0 flex-col border-r bg-background p-6 lg:flex border-amber-600 overflow-y-auto">
        <div
          onClick={() => navigate("/seller/dashboard")}
          className="flex items-center justify-center cursor-pointer gap-2 pr-3"
        >
          {/* <img 
            src={logoPng} 
            alt="Shoppingram Logo" 
            className="h-12 w-auto object-contain pb-1" 
          /> */}
          <h1 className="text-xl font-bold">ShopGram</h1>
        </div>
        {/* <h3 className='text-center mb-0'>Menu</h3> */}
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default Sidebar;