
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import Layout from "@/components/Layout";

const Cart = () => {
  const { 
    cartItems, 
    isLoading, 
    error, 
    removeFromCart, 
    updateQuantity,
    isRemovingFromCart,
    isUpdatingQuantity 
  } = useCart();

  if (isLoading) {
    return (
      <Layout currentPage="cart">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Loading cart...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout currentPage="cart">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Error loading cart. Please try again.</p>
        </div>
      </Layout>
    );
  }

  const total = cartItems?.reduce((sum, item) => {
    return sum + (item.products?.price || 0) * item.quantity;
  }, 0) || 0;

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity({ cartItemId, quantity: newQuantity });
    }
  };

  return (
    <Layout currentPage="cart">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
        <Link to="/products">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>

      {!cartItems || cartItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                      {item.products?.image_url ? (
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.products?.name}</h3>
                      <p className="text-gray-600">${item.products?.price}</p>
                      {item.products?.stock_quantity !== null && (
                        <p className="text-sm text-gray-500">
                          {item.products.stock_quantity} in stock
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={isUpdatingQuantity || item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={isUpdatingQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        ${((item.products?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      disabled={isRemovingFromCart}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full mt-4" size="lg">
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default Cart;
