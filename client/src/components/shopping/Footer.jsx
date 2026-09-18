function Footer() {
  return (
    <footer className="bg-teal-950 text-white text-xs mt-auto">
      {/* Top Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 border-b border-gray-700">
        {/* Column 1: About */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-gray-400 uppercase font-medium tracking-wider mb-1">
            About
          </h2>
          <a href="#" className="hover:underline">
            Contact Us
          </a>
          <a href="#" className="hover:underline">
            About Us
          </a>
          {/* <a href="#" className="hover:underline">Careers</a>
          <a href="#" className="hover:underline">Flipkart Stories</a>
          <a href="#" className="hover:underline">Press</a>
          <a href="#" className="hover:underline">Corporate Information</a> */}
        </div>

        {/* Column 3: Help */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-gray-400 uppercase font-medium tracking-wider mb-1">
            Help
          </h2>
          <a href="#" className="hover:underline">
            Your Account
          </a>
          <a href="#" className="hover:underline">
            Orders
          </a>
          <a href="#" className="hover:underline">
            Shipping
          </a>
          <a href="#" className="hover:underline">
            Cancellation & Returns
          </a>
          <a href="#" className="hover:underline">
            FAQ
          </a>
        </div>

        {/* Column 4: Consumer Policy */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-gray-400 uppercase font-medium tracking-wider mb-1">
            Consumer Policy
          </h2>
          <a href="#" className="hover:underline">
            Cancellation & Returns
          </a>
          <a href="#" className="hover:underline">
            Terms Of Use
          </a>
          <a href="#" className="hover:underline">
            Security
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
        </div>

        {/* Column 5: Mail Us / Registered Address (Border left on large screens like Flipkart)  */}
        <div className="flex flex-col space-y-2 lg:border-l lg:border-gray-700 lg:pl-8">
          <h2 className="text-gray-400 uppercase font-medium tracking-wider mb-1">
            Mail Us:
          </h2>
          <p className="text-gray-300 leading-relaxed">
            ShopGram PVT LTD,
            <br />
            Tech & IT Park
            <br />
            South Delhi
            <br />
            New Delhi, 560103,
            <br />
            Delhi, India
          </p>
          <h2 className="text-gray-400 uppercase font-medium tracking-wider mt-4 mb-1">
            Social:
          </h2>
          <div className="flex space-x-3 text-sm">
            <a href="#" className="hover:text-blue-400">
              FB
            </a>
            <a href="#" className="hover:text-blue-400">
              X
            </a>
            <a href="#" className="hover:text-blue-400">
              YT
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-col items-center justify-between gap-4 text-gray-300">
        <div className="flex justify-around gap-3">
          <div className="flex items-center space-x-2">
            <span>{/* Insert Shop/Brand Icon if needed */}</span>
            <span>Become a Seller</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Advertise</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Gift Cards</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Help Center</span>
          </div>
        </div>
        <div>© 2007-{new Date().getFullYear()} ShopGram.com</div>
      </div>
    </footer>
  );
}

export default Footer;
