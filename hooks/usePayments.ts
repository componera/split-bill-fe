"use client";

import useSWR from "swr";
import axios from "axios";
import { useRealtime } from "./useRealtime";

const fetcher = (url: string) =>
  axios.get(`${process.env.NEXT_PUBLIC_API_URL}${url}`).then((res) => res.data);

export function usePayments(restaurantId: string) {
  const { data, mutate } = useSWR(`/admin/${restaurantId}/payments`, fetcher);

  useRealtime(restaurantId, {
    onPaymentUpdated: () => mutate(),
  });

  return {
    payments: data || [],
    mutate,
  };
}
