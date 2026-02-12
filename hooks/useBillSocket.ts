'use client';
import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';

export function useBillSocket(
    billId: string,
    onUpdate: (bill: any) => void
) {
    useEffect(() => {
        const socket = getSocket();

        // join bill room
        socket.emit('joinBill', { restaurantId: '', billId }); // restaurantId optional if handled by backend

        const handleBillUpdated = (bill: any) => onUpdate(bill);
        const handlePaymentCompleted = (payment: any) => onUpdate(payment);

        socket.on('bill.updated', handleBillUpdated);
        socket.on('payment.completed', handlePaymentCompleted);

        return () => {
            socket.off('bill.updated', handleBillUpdated);
            socket.off('payment.completed', handlePaymentCompleted);
        };
    }, [billId, onUpdate]);
}
