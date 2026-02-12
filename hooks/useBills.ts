import { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { socket } from '../socket';

export function useBills(restaurantId: string) {
  const [bills, setBills] = useState<any[]>([]);

  const fetchBills = async () => {
    const res = await apiFetch(`/admin/${restaurantId}/bills`);
    const data = await res.json();
    setBills(data);
  };

  useEffect(() => {
    fetchBills();
    socket.connect();
    socket.emit('joinRestaurant', restaurantId);

    socket.on('billUpdated', (bill: any) => {
      setBills(prev => prev.map(b => (b.id === bill.id ? bill : b)));
    });

    socket.on('billCreated', (bill: any) => {
      setBills(prev => [bill, ...prev]);
    });

    return () => {
      socket.off('billUpdated');
      socket.off('billCreated');
      socket.disconnect();
    };
  }, [restaurantId]);

  return { bills, fetchBills };
}
