
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    ShoppingCart,
    Star,
    Store,
    Truck,
    ShieldCheck,
    Package
} from "lucide-react";

import { getProductById } from "@/features/shopping/productSlice.js";
import { addToCart } from "@/features/shopping/cartThunk.js";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function ProductDetails() {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        selectedProduct,
        isLoading,
        error,
    } = useSelector((state) => state.products);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (productId) {
            dispatch(getProductById(productId));
        }
    }, [dispatch, productId]);

    // -----------------------------------
    // Loading
    // -----------------------------------

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl px-4 py-8">

                    <div className="mb-8 h-5 w-32 animate-pulse rounded bg-muted" />

                    <div className="grid gap-10 lg:grid-cols-2">

                        <div className="space-y-4">
                            <div className="aspect-square animate-pulse rounded-xl bg-muted" />

                            <div className="flex gap-3">
                                {[1, 2, 3, 4].map((item) => (
                                    <div
                                        key={item}
                                        className="h-20 w-20 animate-pulse rounded-lg bg-muted"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
                            <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
                            <div className="h-24 w-full animate-pulse rounded bg-muted" />
                            <div className="h-12 w-full animate-pulse rounded bg-muted" />
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // -----------------------------------
    // Error
    // -----------------------------------

    if (error) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="text-center">

                    <h2 className="text-xl font-semibold">
                        Unable to load product
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {error}
                    </p>

                    <Button
                        className="mt-5"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>

                </div>
            </div>
        );
    }

    if (!selectedProduct?.product) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <p className="text-muted-foreground">
                    Product not found.
                </p>
            </div>
        );
    }

    const product = selectedProduct.product;
    const images = selectedProduct.images || [];

    /*
     * Adjust this according to your ProductImage schema.
     *
     * Examples:
     * image.url
     * image.imageUrl
     * image.path
     *
     * If your backend stores the URL directly,
     * simply use image.
     */
    const imageUrls = images
        .map((image) => {
            if (typeof image === "string") return image;

            return (
                image.url ||
                image.imageUrl ||
                image.path ||
                image.secure_url
            );
        })
        .filter(Boolean);

    const currentImage = imageUrls[selectedImage];

    const increaseQuantity = () => {
        if (quantity < product.stock) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const previousImage = () => {
        setSelectedImage((prev) =>
            prev === 0 ? imageUrls.length - 1 : prev - 1
        );
    };

    const nextImage = () => {
        setSelectedImage((prev) =>
            prev === imageUrls.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <main className="min-h-screen bg-background lg:bg-gradient-to-b lg:from-background lg:to-muted/20 pb-20 lg:pb-16">
            {/* Header/Breadcrumb area */}
            <div className="mx-auto max-w-7xl px-2 lg:px-4 pt-4 lg:pt-8 pb-2 lg:pb-4">
                <Button
                    variant="ghost"
                    className="gap-2 px-2 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-5 w-5 lg:h-4 lg:w-4" />
                    <span className="hidden lg:inline">Back to products</span>
                </Button>
            </div>

            <section className="mx-auto max-w-7xl lg:px-4 pb-6">
                <div className="grid lg:gap-12 lg:grid-cols-2 items-start">
                    
                    {/* LEFT - IMAGE GALLERY */}
                    <div className="w-full lg:space-y-6 lg:sticky lg:top-24 bg-white dark:bg-zinc-950 lg:bg-transparent lg:dark:bg-transparent pb-4 lg:pb-0 border-b lg:border-none border-border/50">
                        {/* Title & Ratings on Mobile (Amazon style: Title then Rating then Image) */}
                        <div className="px-4 block lg:hidden mb-2">
                            {product.category && (
                                <span className="text-xs font-semibold tracking-wide text-primary uppercase hover:underline cursor-pointer">
                                    {product.category}
                                </span>
                            )}
                            <h1 className="text-xl sm:text-2xl font-medium text-foreground mt-1 mb-2 leading-snug">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-1 mb-2">
                                <div className="flex items-center text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-current" : "fill-muted text-muted"}`} />
                                    ))}
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground -ml-1" />
                                <span className="text-sm font-medium text-primary">
                                    120 ratings
                                </span>
                            </div>
                        </div>

                        {/* Main Image */}
                        <div className="group relative w-full lg:overflow-hidden lg:rounded-3xl lg:bg-white lg:dark:bg-zinc-950 lg:shadow-sm lg:border lg:border-border/50">
                            <div className="aspect-[4/3] sm:aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center p-4 lg:p-8">
                                {currentImage ? (
                                    <img
                                        src={currentImage}
                                        alt={product.name}
                                        className="h-full w-full object-contain drop-shadow-sm lg:drop-shadow-xl transition-transform duration-500 lg:group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <span className="text-muted-foreground flex flex-col items-center gap-2">
                                            <Package className="h-12 w-12 opacity-20" />
                                            No image available
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Controls */}
                            {imageUrls.length > 1 && (
                                <>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 rounded-full shadow-md lg:shadow-lg lg:opacity-0 lg:group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm hover:bg-background h-8 w-8 lg:h-10 lg:w-10"
                                        onClick={previousImage}
                                    >
                                        <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 rounded-full shadow-md lg:shadow-lg lg:opacity-0 lg:group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm hover:bg-background h-8 w-8 lg:h-10 lg:w-10"
                                        onClick={nextImage}
                                    >
                                        <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {imageUrls.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto px-4 lg:px-0 py-2 scrollbar-hide snap-x mt-2 lg:mt-0">
                                {imageUrls.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`
                                            relative h-16 w-16 lg:h-24 lg:w-24 shrink-0 snap-start overflow-hidden rounded-lg lg:rounded-xl bg-white dark:bg-zinc-950 transition-all duration-300
                                            ${selectedImage === index 
                                                ? "ring-2 ring-primary ring-offset-1 lg:ring-offset-2 ring-offset-background lg:scale-95 border-none" 
                                                : "border border-border/50 hover:border-primary/50 hover:shadow-md"
                                            }
                                        `}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            className="h-full w-full object-contain p-1 lg:p-2"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT - PRODUCT INFO */}
                    <div className="flex flex-col px-4 lg:px-0 pt-4 lg:pt-8 bg-background lg:bg-transparent">
                        
                        {/* Desktop Title & Ratings */}
                        <div className="hidden lg:block">
                            <div className="flex items-center gap-3 mb-4">
                                {product.category && (
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
                                        {product.category}
                                    </span>
                                )}
                                {product.stock <= 5 && product.stock > 0 && (
                                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold tracking-wide text-destructive">
                                        Rare Find
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:leading-[1.1] text-foreground">
                                {product.name}
                            </h1>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 px-3 py-1 text-sm font-semibold text-amber-700 dark:text-amber-400">
                                    <span>4.5</span>
                                    <Star className="h-4 w-4 fill-current" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer underline underline-offset-4">
                                    120 verified ratings
                                </span>
                            </div>
                            <Separator className="my-8 opacity-50" />
                        </div>

                        {/* Pricing */}
                        <div className="flex flex-col mt-2 lg:mt-0">
                            <div className="flex items-start gap-1">
                                <span className="text-sm font-medium mt-1 lg:mt-2 lg:text-xl">₹</span>
                                <span className="text-3xl lg:text-5xl font-medium lg:font-black tracking-tight lg:tracking-tighter">
                                    {Number(product.price).toLocaleString("en-IN")}
                                </span>
                            </div>
                            <p className="mt-1 text-xs lg:text-sm text-muted-foreground">
                                Inclusive of all applicable taxes
                            </p>
                        </div>
                        
                        <div className="mt-3 text-sm lg:text-base text-foreground">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">FREE delivery</span> 
                            {" "} <span className="font-bold">Tomorrow, 11 AM</span>. Order within 5 hrs 30 mins.
                        </div>

                        {/* Availability */}
                        <div className="mt-4">
                            {product.stock > 0 ? (
                                <p className="text-lg lg:text-xl font-medium text-emerald-700 dark:text-emerald-500">
                                    {product.stock <= 5 ? `Only ${product.stock} left in stock - order soon.` : "In stock"}
                                </p>
                            ) : (
                                <p className="text-lg lg:text-xl font-medium text-destructive">
                                    Temporarily out of stock.
                                </p>
                            )}
                        </div>

                        {/* Purchase Actions */}
                        <div className="mt-6 flex flex-col gap-3 lg:rounded-3xl lg:bg-card lg:border lg:border-border/50 lg:p-6 lg:shadow-sm">
                            
                            {product.stock > 0 && (
                                <>
                                    {/* Quantity */}
                                    <div className="flex items-center gap-3 mb-2 lg:mb-4">
                                        <span className="text-sm font-medium lg:hidden">Quantity:</span>
                                        <div className="flex items-center rounded-xl lg:rounded-2xl border border-border lg:border-border/50 bg-background shadow-sm p-1 lg:p-1.5 w-fit">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={decreaseQuantity}
                                                disabled={quantity <= 1}
                                                className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg lg:rounded-xl hover:bg-muted"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-12 lg:w-14 text-center font-medium lg:font-semibold text-base lg:text-lg">
                                                {quantity}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={increaseQuantity}
                                                disabled={quantity >= product.stock}
                                                className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg lg:rounded-xl hover:bg-muted"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col lg:flex-row gap-3">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="w-full lg:flex-1 h-12 lg:h-14 rounded-full lg:rounded-2xl font-semibold lg:shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 bg-white hover:bg-gray-50 text-foreground border-2 border-border"
                                            onClick={() => {
                                                dispatch(addToCart({ productId: product._id, quantity }))
                                                    .unwrap()
                                                    .then(() => toast.success("Added to cart"))
                                                    .catch((err) => toast.error(err?.error || err?.message || "Failed to add to cart"));
                                            }}
                                        >
                                            <ShoppingCart className="mr-2 h-5 w-5 lg:hidden" />
                                            Add to Cart
                                        </Button>
                                        <Button
                                            size="lg"
                                            className="w-full lg:flex-1 h-12 lg:h-14 rounded-full lg:rounded-2xl font-semibold hover:-translate-y-0.5 active:translate-y-0 transition-all bg-teal-600 hover:bg-teal-700 text-white border-none shadow-md shadow-teal-900/20"
                                        >
                                            Buy Now
                                        </Button>
                                    </div>
                                    
                                    <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground lg:hidden">
                                        <ShieldCheck className="h-4 w-4" /> Secure transaction
                                    </div>
                                </>
                            )}
                        </div>

                        <Separator className="my-6 border-4 lg:hidden opacity-50" />

                        {/* Description */}
                        <div className="mt-2 lg:mt-8 prose prose-slate dark:prose-invert max-w-none">
                            <h3 className="text-lg lg:text-xl font-bold mb-2">About this item</h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm lg:text-base text-foreground lg:text-muted-foreground marker:text-foreground lg:marker:text-muted-foreground">
                                <li>{product.description}</li>
                            </ul>
                        </div>
                        
                    </div>
                </div>
            </section>

            <Separator className="my-2 border-4 lg:hidden opacity-50" />

            {/* Extra Info Grid */}
            <section className="mx-auto max-w-7xl px-4 py-4 lg:py-16">
                <h3 className="text-xl font-bold mb-4 lg:hidden">Product Details</h3>
                <div className="grid gap-4 lg:gap-6 md:grid-cols-3">
                    <Card className="group relative overflow-hidden rounded-xl lg:rounded-3xl border lg:border-none bg-background lg:bg-gradient-to-br lg:from-card lg:to-muted/50 p-4 lg:p-8 shadow-sm lg:transition-all lg:hover:shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 hidden lg:block" />
                        <div className="relative flex items-center lg:block gap-4">
                            <div className="flex h-10 w-10 lg:mb-5 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-full lg:rounded-2xl bg-muted lg:bg-background shadow-sm">
                                <Store className="h-5 w-5 lg:h-6 lg:w-6 text-primary lg:text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm lg:text-xl font-medium lg:font-bold">Sold by {product.sellerId?.name || "Verified Seller"}</h3>
                                <p className="mt-1 lg:mt-3 text-xs lg:text-sm leading-relaxed text-muted-foreground">
                                    Premium merchant with a track record of quality products.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="group relative overflow-hidden rounded-xl lg:rounded-3xl border lg:border-none bg-background lg:bg-gradient-to-br lg:from-card lg:to-muted/50 p-4 lg:p-8 shadow-sm lg:transition-all lg:hover:shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 hidden lg:block" />
                        <div className="relative flex items-center lg:block gap-4">
                            <div className="flex h-10 w-10 lg:mb-5 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-full lg:rounded-2xl bg-muted lg:bg-background shadow-sm">
                                <ShieldCheck className="h-5 w-5 lg:h-6 lg:w-6 text-primary lg:text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm lg:text-xl font-medium lg:font-bold">Premium Quality</h3>
                                <p className="mt-1 lg:mt-3 text-xs lg:text-sm leading-relaxed text-muted-foreground">
                                    All our products go through strict quality checks.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="group relative overflow-hidden rounded-xl lg:rounded-3xl border lg:border-none bg-background lg:bg-gradient-to-br lg:from-card lg:to-muted/50 p-4 lg:p-8 shadow-sm lg:transition-all lg:hover:shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 hidden lg:block" />
                        <div className="relative flex items-center lg:block gap-4">
                            <div className="flex h-10 w-10 lg:mb-5 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-full lg:rounded-2xl bg-muted lg:bg-background shadow-sm">
                                <Truck className="h-5 w-5 lg:h-6 lg:w-6 text-primary lg:text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm lg:text-xl font-medium lg:font-bold">Fast & Secure Delivery</h3>
                                <p className="mt-1 lg:mt-3 text-xs lg:text-sm leading-relaxed text-muted-foreground">
                                    Delivery availability calculated precisely based on location.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </main>
    );
}

export default ProductDetails;

