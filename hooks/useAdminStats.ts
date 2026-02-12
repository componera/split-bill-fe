import useSWR from "swr";
import axios from "axios";

export const useAdminStats = (restaurantId: string) => {
  const { data, error } = useSWR(
    restaurantId ? `/api/admin/${restaurantId}/stats` : null,
    (url) => axios.get(url).then((res) => res.data),
    { refreshInterval: 10000 }, // every 10 sec
  );

  return {
    stats: data,
    isLoading: !data && !error,
    isError: error,
  };
};
