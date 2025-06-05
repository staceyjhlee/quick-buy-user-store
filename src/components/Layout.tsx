
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const Layout = ({ children, currentPage }: LayoutProps) => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            <Link to="/">QuickBuy Store</Link>
          </h1>
          <nav className="hidden md:flex space-x-4">
            <Link 
              to="/" 
              className={`text-gray-600 hover:text-gray-900 ${currentPage === 'home' ? 'font-medium' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`text-gray-600 hover:text-gray-900 ${currentPage === 'products' ? 'font-medium' : ''}`}
            >
              Products
            </Link>
            <Link 
              to="/orders" 
              className={`text-gray-600 hover:text-gray-900 ${currentPage === 'orders' ? 'font-medium' : ''}`}
            >
              Orders
            </Link>
            <Link 
              to="/users" 
              className={`text-gray-600 hover:text-gray-900 ${currentPage === 'users' ? 'font-medium' : ''}`}
            >
              Users
            </Link>
            <Link 
              to="/cart" 
              className={`text-gray-600 hover:text-gray-900 ${currentPage === 'cart' ? 'font-medium' : ''}`}
            >
              Cart
            </Link>
          </nav>
          <div className="flex space-x-2 items-center">
            <Link to="/cart">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            
            {!loading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {user.email?.split('@')[0] || 'User'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              )
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex-1">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <p className="text-center">&copy; 2025 QuickBuy Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
