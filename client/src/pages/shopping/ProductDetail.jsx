
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
} from "lucide-react";

import { getProductById } from "@/features/shopping/productSlice.js";

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
        <main className="min-h-screen bg-background">

            {/* -------------------------------- */}
            {/* Back Button */}
            {/* -------------------------------- */}

            <div className="mx-auto max-w-7xl px-4 pt-6">

                <Button
                    variant="ghost"
                    className="gap-2 px-0 hover:bg-transparent"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to products
                </Button>

            </div>

            {/* -------------------------------- */}
            {/* Main Product Section */}
            {/* -------------------------------- */}

            <section className="mx-auto max-w-7xl px-4 py-8">

                <div className="grid gap-10 lg:grid-cols-2">

                    {/* ============================== */}
                    {/* LEFT - IMAGE GALLERY */}
                    {/* ============================== */}

                    <div className="space-y-4">

                        {/* Main Image */}

                        <div className="relative overflow-hidden rounded-xl border bg-muted">

                            <div className="aspect-square">

                                {currentImage ? (
                                    <img
                                        src={currentImage}
                                        alt={product.name}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <span className="text-muted-foreground">
                                            No image available
                                        </span>
                                    </div>
                                )}

                            </div>

                            {/* Previous */}

                            {imageUrls.length > 1 && (
                                <>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full shadow"
                                        onClick={previousImage}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>

                                    {/* Next */}

                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full shadow"
                                        onClick={nextImage}
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                </>
                            )}

                        </div>

                        {/* Thumbnail Gallery */}

                        {imageUrls.length > 0 && (
                            <div className="flex gap-3 overflow-x-auto pb-1">

                                {imageUrls.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`
                                            h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-muted
                                            transition
                                            ${
                                                selectedImage === index
                                                    ? "border-primary"
                                                    : "border-transparent hover:border-muted-foreground/30"
                                            }
                                        `}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}

                            </div>
                        )}

                    </div>

                    {/* ============================== */}
                    {/* RIGHT - PRODUCT INFORMATION */}
                    {/* ============================== */}

                    <div className="flex flex-col">

                        {/* Category */}

                        {product.category && (
                            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                                {product.category}
                            </p>
                        )}

                        {/* Product Name */}

                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                            {product.name}
                        </h1>

                        {/* Rating */}

                        <div className="mt-4 flex items-center gap-3">

                            <div className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground">
                                <span>4.5</span>
                                <Star className="h-3.5 w-3.5 fill-current" />
                            </div>

                            <span className="text-sm text-muted-foreground">
                                120 ratings
                            </span>

                        </div>

                        <Separator className="my-6" />

                        {/* Price */}

                        <div>

                            <span className="text-3xl font-bold">
                                ₹{Number(product.price).toLocaleString("en-IN")}
                            </span>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Inclusive of all applicable taxes
                            </p>

                        </div>

                        {/* Description */}

                        <div className="mt-6">

                            <h2 className="mb-2 text-lg font-semibold">
                                Description
                            </h2>

                            <p className="leading-7 text-muted-foreground">
                                {product.description}
                            </p>

                        </div>

                        {/* Seller */}

                        <Card className="mt-6 p-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                    <Store className="h-5 w-5" />
                                </div>

                                <div>

                                    <p className="text-sm text-muted-foreground">
                                        Sold by
                                    </p>

                                    <p className="font-semibold">
                                        {product.sellerId?.name || "Seller"}
                                    </p>

                                </div>

                            </div>

                        </Card>

                        {/* Stock */}

                        <div className="mt-6">

                            {product.stock > 0 ? (
                                <p className="text-sm font-medium text-green-600">
                                    {product.stock <= 5
                                        ? `Only ${product.stock} left in stock`
                                        : "In stock"}
                                </p>
                            ) : (
                                <p className="text-sm font-medium text-destructive">
                                    Out of stock
                                </p>
                            )}

                        </div>

                        {/* Quantity */}

                        {product.stock > 0 && (
                            <div className="mt-5">

                                <p className="mb-2 text-sm font-medium">
                                    Quantity
                                </p>

                                <div className="flex w-fit items-center rounded-lg border">

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1}
                                        className="rounded-r-none"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>

                                    <span className="w-12 text-center font-medium">
                                        {quantity}
                                    </span>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={increaseQuantity}
                                        disabled={quantity >= product.stock}
                                        className="rounded-l-none"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>

                                </div>

                            </div>
                        )}

                        {/* Actions */}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                            <Button
                                size="lg"
                                className="flex-1 gap-2"
                                disabled={product.stock <= 0}
                                onClick={() => {
                                    // Connect your add-to-cart thunk here
                                    console.log("Add to cart", {
                                        productId: product._id,
                                        quantity,
                                    });
                                }}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Add to Cart
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="flex-1"
                                disabled={product.stock <= 0}
                            >
                                Buy Now
                            </Button>

                        </div>

                    </div>

                </div>

            </section>

            {/* -------------------------------- */}
            {/* Product Information */}
            {/* -------------------------------- */}

            <section className="mx-auto max-w-7xl px-4 pb-12">

                <Separator className="mb-8" />

                <div className="grid gap-6 md:grid-cols-3">

                    <Card className="p-5">

                        <h3 className="font-semibold">
                            Product Information
                        </h3>

                        <div className="mt-4 space-y-3 text-sm">

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Category
                                </span>

                                <span>
                                    {product.category || "N/A"}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Stock
                                </span>

                                <span>
                                    {product.stock}
                                </span>
                            </div>

                        </div>

                    </Card>

                    <Card className="p-5">

                        <h3 className="font-semibold">
                            Seller
                        </h3>

                        <div className="mt-4 flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                <Store className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="font-medium">
                                    {product.sellerId?.name || "Seller"}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    Verified Seller
                                </p>
                            </div>

                        </div>

                    </Card>

                    <Card className="p-5">

                        <h3 className="font-semibold">
                            Delivery
                        </h3>

                        <p className="mt-4 text-sm leading-6 text-muted-foreground">
                            Delivery availability and estimated delivery
                            date will be calculated based on your location.
                        </p>

                    </Card>

                </div>

            </section>

        </main>
    );
}

export default ProductDetails;

