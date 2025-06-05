
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";

const Products = () => {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Error loading products. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            <Link to="/">QuickBuy Store</Link>
          </h1>
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-gray-900 font-medium">Products</Link>
            <Link to="/orders" className="text-gray-600 hover:text-gray-900">Orders</Link>
            <Link to="/users" className="text-gray-600 hover:text-gray-900">Users</Link>
          </nav>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button>Sign In</Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
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
                <Button>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <p className="text-center">&copy; 2025 QuickBuy Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Products;
