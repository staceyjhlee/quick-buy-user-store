
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { ArrowLeft } from 'lucide-react';

interface CheckoutFormProps {
  cartItems: any[];
  total: number;
  user: User | null;
  onBack: () => void;
}

const CheckoutForm = ({ cartItems, total, user, onBack }: CheckoutFormProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    email: '',
    fullName: '',
    phone: ''
  });
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const handleGuestInfoChange = (field: string, value: string) => {
    setGuestInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleShippingChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const processOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Create order in database
      const orderData = {
        user_id: user?.id || null,
        total_amount: total,
        status: 'pending',
        guest_email: user ? null : guestInfo.email,
        guest_name: user ? null : guestInfo.fullName,
        shipping_address: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country
        }
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products?.price || 0
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      const { error: clearCartError } = await supabase
        .from('cart_items')
        .delete()
        .in('id', cartItems.map(item => item.id));

      if (clearCartError) throw clearCartError;

      toast({
        title: "Order placed successfully!",
        description: `Order #${order.id.slice(0, 8)} has been created.`,
      });

      // Redirect or show success page
      onBack();
      
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isValidOrder = () => {
    const hasValidShipping = shippingInfo.address && shippingInfo.city && 
                            shippingInfo.state && shippingInfo.zipCode;
    
    if (user) {
      return hasValidShipping;
    } else {
      return hasValidShipping && guestInfo.email && guestInfo.fullName;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="outline" onClick={onBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={user ? "shipping" : "guest"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="guest" disabled={!!user}>
                    {user ? "Signed In" : "Guest Checkout"}
                  </TabsTrigger>
                  <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
                </TabsList>
                
                {!user && (
                  <TabsContent value="guest" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="guest-email">Email</Label>
                      <Input
                        id="guest-email"
                        type="email"
                        placeholder="Enter your email"
                        value={guestInfo.email}
                        onChange={(e) => handleGuestInfoChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guest-name">Full Name</Label>
                      <Input
                        id="guest-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={guestInfo.fullName}
                        onChange={(e) => handleGuestInfoChange('fullName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guest-phone">Phone (Optional)</Label>
                      <Input
                        id="guest-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={guestInfo.phone}
                        onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
                      />
                    </div>
                  </TabsContent>
                )}
                
                <TabsContent value="shipping" className="space-y-4">
                  {user && (
                    <div className="bg-green-50 p-3 rounded-md mb-4">
                      <p className="text-sm text-green-700">
                        Signed in as: {user.email}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={shippingInfo.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={shippingInfo.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="State"
                        value={shippingInfo.state}
                        onChange={(e) => handleShippingChange('state', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="12345"
                        value={shippingInfo.zipCode}
                        onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="US"
                        value={shippingInfo.country}
                        onChange={(e) => handleShippingChange('country', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">{item.products?.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      ${((item.products?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  size="lg"
                  onClick={processOrder}
                  disabled={!isValidOrder() || isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
