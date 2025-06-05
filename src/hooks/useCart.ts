
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Generate a session ID for non-authenticated users
const getSessionId = () => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export const useCart = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  // Fetch cart items
  const { data: cartItems, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      console.log("Fetching cart items from Supabase...");
      const user = await getCurrentUser();
      const sessionId = getSessionId();

      let query = supabase
        .from("cart_items")
        .select(`
          *,
          products(id, name, price, image_url, stock_quantity)
        `);

      if (user) {
        query = query.eq("user_id", user.id);
      } else {
        query = query.eq("session_id", sessionId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching cart items:", error);
        throw error;
      }

      console.log("Cart items fetched:", data);
      return data;
    },
  });

  // Add item to cart
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      const user = await getCurrentUser();
      const sessionId = getSessionId();

      // Check if item already exists in cart
      let existingQuery = supabase
        .from("cart_items")
        .select("*")
        .eq("product_id", productId);

      if (user) {
        existingQuery = existingQuery.eq("user_id", user.id);
      } else {
        existingQuery = existingQuery.eq("session_id", sessionId);
      }

      const { data: existing } = await existingQuery.single();

      if (existing) {
        // Update quantity if item exists
        const { data, error } = await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id)
          .select();

        if (error) throw error;
        return data;
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from("cart_items")
          .insert({
            product_id: productId,
            quantity,
            user_id: user?.id || null,
            session_id: user ? null : sessionId,
          })
          .select();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart successfully.",
      });
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove item from cart
  const removeFromCartMutation = useMutation({
    mutationFn: async (cartItemId: string) => {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    },
    onError: (error) => {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update item quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
      if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", cartItemId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    cartItems,
    isLoading,
    error,
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    isUpdatingQuantity: updateQuantityMutation.isPending,
  };
};
