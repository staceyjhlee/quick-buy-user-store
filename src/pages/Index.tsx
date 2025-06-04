
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ShoppingCart, Users, Package } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">QuickBuy Store</h1>
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
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
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-center">E-Commerce Platform</h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
            Manage your products, users, and orders in one place
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products
                </CardTitle>
                <CardDescription>
                  Manage your product catalog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Add, edit, and remove products from your store.</p>
              </CardContent>
              <CardFooter>
                <Link to="/products">
                  <Button>View Products</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Users
                </CardTitle>
                <CardDescription>
                  Manage your user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>View and manage user accounts and permissions.</p>
              </CardContent>
              <CardFooter>
                <Link to="/users">
                  <Button>View Users</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </CardTitle>
                <CardDescription>
                  Track customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>View and process customer orders and transactions.</p>
              </CardContent>
              <CardFooter>
                <Link to="/orders">
                  <Button>View Orders</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <p className="text-center">&copy; 2025 QuickBuy Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
