
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      console.log("Fetching orders from Supabase...");
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles(full_name, email),
          order_items(quantity, price, products(name))
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      console.log("Orders fetched:", data);
      return data;
    },
  });
};
