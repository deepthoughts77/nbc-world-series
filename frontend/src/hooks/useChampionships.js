import { useQuery } from "@tanstack/react-query";
import { API } from "../api/apiClient";
import { pickArray } from "../utils/data";

const fetchChampionships = async () => {
  const res = await API.get("/championships");

  // DEBUG LOGGING
  console.log("=== CHAMPIONSHIPS DEBUG ===");
  console.log("Full response:", res);
  console.log("res.data:", res.data);
  console.log("res.data.data:", res.data?.data);
  console.log("res.data.data.length:", res.data?.data?.length);

  const picked = pickArray(res);
  console.log("After pickArray:", picked);
  console.log("After pickArray length:", picked.length);
  console.log("=========================");

  return picked;
};

export function useChampionships() {
  const {
    data: years = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["championships"],
    queryFn: fetchChampionships,
  });

  console.log("Final years in hook:", years.length);

  return { years, isLoading, isError, error };
}
