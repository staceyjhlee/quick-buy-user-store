
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfiles = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      console.log("Fetching profiles from Supabase...");
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          orders(id)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }

      console.log("Profiles fetched:", data);
      return data;
    },
  });
};
