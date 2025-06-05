
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import Layout from "@/components/Layout";

const Products = () => {
  const { data: products, isLoading, error } = useProducts();
  const { addToCart, isAddingToCart } = useCart();

  if (isLoading) {
    return (
      <Layout currentPage="products">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Loading products...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout currentPage="products">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Error loading products. Please try again.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="products">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button>Add New Product</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products?.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Product Image</span>
              )}
            </div>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <p className="font-semibold text-lg">${product.price}</p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{product.description}</p>
              {product.stock_quantity !== null && (
                <p className="text-sm text-gray-500 mt-2">
                  Stock: {product.stock_quantity} available
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View Details</Button>
              <Button
                onClick={() => addToCart({ productId: product.id })}
                disabled={isAddingToCart || product.stock_quantity === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Products;
