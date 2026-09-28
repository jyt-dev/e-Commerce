import { getProducts } from "@/features/shopping/productSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCardList from "./ProductCardList";
import { useSearchParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "../../components/shopping/Sidebar";

const sortOptions = [
    { value: "createdAt-desc", label: "Newest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
];

function Products() {
    const dispatch = useDispatch();
    const { productList, pagination, error, isLoading } = useSelector((state) => state.products);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const params = {};
        const category = searchParams.get("category");
        const query = searchParams.get("query");
        const sortBy = searchParams.get("sortBy");
        const sortType = searchParams.get("sortType");
        const page = searchParams.get("page") || "1";
        
        if (category) params.category = category;
        if (query) params.query = query;
        if (sortBy) params.sortBy = sortBy;
        if (sortType) params.sortType = sortType;
        if (page) params.page = page;

        dispatch(getProducts(params));
    }, [dispatch, searchParams]);

    const handleSortChange = (value) => {
        const [sortBy, sortType] = value.split("-");
        searchParams.set("sortBy", sortBy);
        searchParams.set("sortType", sortType);
        searchParams.set("page", "1"); // Reset to page 1 on sort
        setSearchParams(searchParams);
    };

    const handlePageChange = (newPage) => {
        searchParams.set("page", newPage);
        setSearchParams(searchParams);
    };
    
    const currentSort = searchParams.get("sortBy") ? `${searchParams.get("sortBy")}-${searchParams.get("sortType")}` : "createdAt-desc";

    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        {pagination?.totalDocs ? `${pagination.totalDocs} Products` : `${productList.length} Products`}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={currentSort} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="sm:hidden">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0">
                            <Sidebar className="w-full h-full border-none" />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {isLoading ? (
                <div className="p-4">Loading products...</div>
            ) : error ? (
                <div className="p-4 text-red-500">Error: {error}</div>
            ) : !productList.length ? (
                <div className="p-4">No products found.</div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mx-2 mt-4 sm:mx-6 bg-white border-none pb-10">
                        {productList.map((product) => (
                            <ProductCardList key={product._id} product={product} />
                        ))}
                    </div>
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 py-6 border-t border-gray-100 mt-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.prevPage)}
                                disabled={!pagination.hasPrevPage}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Previous
                            </Button>
                            <span className="text-sm text-gray-600">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.nextPage)}
                                disabled={!pagination.hasNextPage}
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Products;