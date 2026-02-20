"use client";

import { io, type Socket } from "socket.io-client";
import { SOCKET_URL } from "./constants";

export interface SocketEvents {
  "bill.created": (bill: any) => void;
  "bill.updated": (bill: any) => void;
  "payment.completed": (payment: any) => void;
  "bill.closed": (bill: any) => void;
  "joinBill": (payload: { restaurantId: string; billId: string }) => void;
  "joinRestaurant": (payload: { restaurantId: string }) => void;
  "leaveRestaurant": (payload: { restaurantId: string }) => void;
}

let socket: Socket<SocketEvents> | null = null;

export function connectSocket(): Socket<SocketEvents> {
  if (socket) return socket;

  if (typeof window === "undefined") {
    throw new Error("Sockets can only be initialized in the browser");
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true, // critical - sends cookies
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket error:", err.message);

    if (err.message === "Unauthorized") {
      window.location.href = "/login";
    }
  });

  return socket;
}

export function getSocket(): Socket<SocketEvents> {
  if (!socket) return connectSocket();
  return socket;
}

/**
 * Strongly-typed emit helper
 */
export function emitEvent<K extends keyof SocketEvents>(
  event: K,
  ...args: Parameters<SocketEvents[K]>
) {
  getSocket().emit(event, ...args);
}
