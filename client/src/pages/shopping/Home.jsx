import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useState } from "react"
import Autoplay from "embla-carousel-autoplay"
import { Link } from "react-router-dom"
import { CircleUserRound, Package, Heart, Gift, Headset, Store, MapPinned } from "lucide-react"
import CardHome from "./extras/CardHome.jsx";
const corouselImages = [
  { id: "banner_1", src: "/assets/crousal/banner_1.jpg" }, 
  { id: "banner_2", src: "/assets/crousal/banner_2.jpg" },
  { id: "banner_3", src: "/assets/crousal/banner_3.jpg" },
  { id: "banner_4", src: "/assets/crousal/banner_4.jpg" },
  { id: "banner_5", src: "/assets/crousal/banner_5.jpg" }
];

const shopPhones = [
  { id: "p6", src: "/assets/Phones/p6.webp", path: "" },
  { id: "p4", src: "/assets/Phones/p4.webp", path: "" },
  { id: "p7", src: "/assets/Phones/p7.webp", path: "" },
  { id: "p11", src: "/assets/Phones/p11.webp", path: "" },
  { id: "p10", src: "/assets/Phones/p10.webp", path: "" },
  { id: "p2", src: "/assets/Phones/p2.webp", path: "" },
];

const trendingOutfits = [
  { id: "s1", src: "/assets/Trending-Outfits/s1.webp", path: "" },
  { id: "s2", src: "/assets/Trending-Outfits/s2.webp", path: "" },
  { id: "s3", src: "/assets/Trending-Outfits/s3.webp", path: "" },
  { id: "s4", src: "/assets/Trending-Outfits/s4.webp", path: "" },
  { id: "s5", src: "/assets/Trending-Outfits/s5.webp", path: "" },
  { id: "s6", src: "/assets/Trending-Outfits/s6.webp", path: "" },
];

const toys = [
  { id: "t1", src: "/assets/Toys/toy1.webp", path: "" },
  { id: "t2", src: "/assets/Toys/toy2.webp", path: "" },
  { id: "t3", src: "/assets/Toys/toy3.webp", path: "" },
  { id: "t4", src: "/assets/Toys/toy4.webp", path: "" },
];

const travel = [
  { id: "b1", src: "/assets/Travel/b1.webp", path: "" },
  { id: "b2", src: "/assets/Travel/b2.webp", path: "" },
  { id: "b3", src: "/assets/Travel/b3.webp", path: "" },
  { id: "b4", src: "/assets/Travel/b4.webp", path: "" },
];

const clgEssentials = [
  { id: "e1", src: "/assets/College/e1.webp", path: "" },
  { id: "e2", src: "/assets/College/e2.webp", path: "" },
  { id: "e3", src: "/assets/College/e3.webp", path: "" },
  { id: "e4", src: "/assets/College/e4.webp", path: "" },
];

const beautyP = [
  { id: "bt1", src: "/assets/Beauty/bt1.webp", path: "" },
  { id: "bt2", src: "/assets/Beauty/bt2.webp", path: "" },
  { id: "bt3", src: "/assets/Beauty/bt3.webp", path: "" },
  { id: "bt4", src: "/assets/Beauty/bt4.webp", path: "" },
];

const books = [
  { id: "bk1", src: "/assets/Books/bk1.webp", path: "" },
  { id: "bk2", src: "/assets/Books/bk2.webp", path: "" },
  { id: "bk3", src: "/assets/Books/bk3.webp", path: "" },
  { id: "bk4", src: "/assets/Books/bk4.webp", path: "" },
  { id: "bk5", src: "/assets/Books/bk5.webp", path: "" },
  { id: "bk6", src: "/assets/Books/bk6.webp", path: "" },
];

const populars = [
  { id: "pop1", src: "/assets/Populars/pop1.webp", path: "" },
  { id: "pop2", src: "/assets/Populars/pop2.webp", path: "" },
  { id: "pop3", src: "/assets/Populars/pop3.webp", path: "" },
  { id: "pop4", src: "/assets/Populars/pop4.webp", path: "" },
  { id: "pop5", src: "/assets/Populars/pop5.webp", path: "" },
  { id: "pop6", src: "/assets/Populars/pop6.webp", path: "" },
];

function Home() {
    // Initialize state with a function so it only runs once, returning the array expected by shadcn
    const [plugin] = useState(() => [
      Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: false })
    ])

    return (
      <div className="min-h-screen bg-gray-50/50 pb-10">
        {/* Hero Carousel */}
        <div className="mb-10 shadow-sm">
          <Carousel
            className="w-full"
            plugins={plugin}
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {corouselImages.map((img, index) => (
                <CarouselItem key={img.id}>
                  <img
                    src={img.src}
                    alt="Hero Banner"
                    decoding="async"
                    className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] object-cover cursor-pointer"
                    fetchPriority={index === 0 ? "high" : undefined}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 h-10 w-10 text-gray-800 bg-white/80 hover:bg-white border-none shadow-md cursor-pointer hidden md:flex" />
            <CarouselNext className="right-4 h-10 w-10 text-gray-800 bg-white/80 hover:bg-white border-none shadow-md cursor-pointer hidden md:flex" />
          </Carousel>
        </div>



        {/* Smartphones Section */}
        <section className="mx-4 md:mx-10 lg:mx-15 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Smartphones Top Picks</h3>
            <a href="#" className="text-sm font-medium text-primary hover:underline transition-all">View All &rarr;</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {shopPhones.map((phone) => (
              <CardHome key={phone.id} src={phone.src} />
            ))}
          </div>
        </section>

        {/* Trending Outfits Section */}
        <section className="mx-4 md:mx-10 lg:mx-15 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Trending Outfits</h3>
            <a href="#" className="text-sm font-medium text-primary hover:underline transition-all">View All &rarr;</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {trendingOutfits.map((tr) => (
              <CardHome key={tr.id} src={tr.src} />
            ))}
          </div>
        </section>

        {/* Categorized 4-Grid Block */}
        <section className="mx-4 md:mx-10 lg:mx-15 mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-800">Toys & Games</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {toys.map((toy) => (
                <CardHome key={toy.id} src={toy.src} className="h-28 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-800">Travel Gear</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {travel.map((tr) => (
                <CardHome key={tr.id} src={tr.src} className="h-28 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-800">College Essentials</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {clgEssentials.map((clg) => (
                <CardHome key={clg.id} src={clg.src} className="h-28 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-800">Beauty Products</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {beautyP.map((bt) => (
                <CardHome key={bt.id} src={bt.src} className="h-28 rounded-lg" />
              ))}
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="mx-4 md:mx-10 lg:mx-15 mb-12">
          <div className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
            <img
              src="/assets/summersale.webp"
              alt="Summer Sale"
              className="w-full h-32 sm:h-48 md:h-72 object-cover group-hover:scale-[1.02] transition-transform duration-700"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
          </div>
        </section>

        {/* Best Selling Books Section */}
        <section className="mx-4 md:mx-10 lg:mx-15 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">NYT Best Selling Books</h3>
            <a href="#" className="text-sm font-medium text-primary hover:underline transition-all">Explore Books &rarr;</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {books.map((book) => (
              <CardHome key={book.id} src={book.src} className="h-48 md:h-64 object-cover" />
            ))}
          </div>
        </section>

        {/* Popular Picks Section */}
        <section className="mx-4 md:mx-10 lg:mx-15 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Popular Picks</h3>
            <a href="#" className="text-sm font-medium text-primary hover:underline transition-all">View All &rarr;</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {populars.map((popular) => (
              <CardHome key={popular.id} src={popular.src} />
            ))}
          </div>
        </section>
      </div>
    );
}

export default Home;
