import { Outlet } from "react-router-dom";
import { Star, ShieldCheck, Zap } from 'lucide-react';

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side: Form Outlet (Full height, no boxes) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-sm animate-in fade-in duration-500">
          <Outlet />
        </div>
      </div>

      {/* Right Side: Promotional content (Full height, edge-to-edge) */}
      <div className="hidden lg:flex w-1/2 bg-teal-950 flex-col justify-center items-center p-12 lg:p-24 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-teal-900 to-teal-800 rounded-full blur-3xl opacity-50 -z-10"></div>
        
        <div className="w-full max-w-md space-y-12 text-white">
          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold tracking-tight">Start Shopping Today</h2>
            <p className="text-teal-100 text-lg leading-relaxed">
              Experience a premium, personalized shopping journey on SynXShop. Handpicked collections curated just for you.
            </p>
            <div className="flex items-center gap-6 text-sm font-semibold text-teal-200">
              <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Secure Checkout</span>
              <span className="flex items-center gap-2"><Zap className="w-5 h-5" /> Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
