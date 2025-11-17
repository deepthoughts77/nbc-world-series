import { useQuery } from "@tanstack/react-query";
import { API } from "../api/apiClient";
import { pickArray } from "../utils/data";

// This is the function that fetches the data
const fetchChampionships = async () => {
  const res = await API.get("/championships");
  // Use pickArray to safely get the 'data' array from the response
  return pickArray(res);
};

// This is your new hook
export function useChampionships() {
  // We rename 'data' to 'years' for the component to use
  const {
    data: years = [], // Default to [] to prevent errors
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["championships"], // The cache key
    queryFn: fetchChampionships, // The function to run
  });

  return { years, isLoading, isError, error };
}
