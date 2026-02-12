'use client';
import { io, Socket } from 'socket.io-client';
import { getToken } from './auth';

export interface SocketEvents {
  'bill.created': (bill: any) => void;
  'bill.updated': (bill: any) => void;
  'payment.completed': (payment: any) => void;
  'bill.closed': (bill: any) => void;

  'joinBill': (payload: { restaurantId: string; billId: string }) => void;
  'joinRestaurant': (payload: { restaurantId: string }) => void;
}

let socket: Socket<SocketEvents> | null = null;

export function connectSocket(): Socket<SocketEvents> {
  if (socket) return socket;

  const token = getToken();

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    transports: ['websocket'],
    auth: { token },
  });

  socket.on('connect', () => console.log('Socket connected:', socket?.id));
  socket.on('disconnect', reason => console.log('Socket disconnected:', reason));
  socket.on('connect_error', err => {
    console.error('Socket error', err.message);
    if (err.message === 'Unauthorized') {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
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
 * @param event Event name
 * @param args Arguments for the event (tuple)
 */
export function emitEvent<K extends keyof SocketEvents>(
  event: K,
  ...args: Parameters<SocketEvents[K]>
) {
  getSocket().emit(event, ...args);
}
