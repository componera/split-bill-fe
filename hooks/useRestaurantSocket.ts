"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

interface Callbacks {

    onBillCreated?: (bill: any) => void;
    onBillUpdated?: (bill: any) => void;
    onPaymentCompleted?: (payment: any) => void;
    onBillClosed?: (bill: any) => void;
}

export function useRestaurantSocket(
    restaurantId: string,
    callbacks: Callbacks
) {

    useEffect(() => {

        if (!restaurantId) return;

        const socket = getSocket();

        socket.emit("joinRestaurant", { restaurantId });

        socket.on("bill.created", callbacks.onBillCreated || (() => { }));
        socket.on("bill.updated", callbacks.onBillUpdated || (() => { }));
        socket.on("payment.completed", callbacks.onPaymentCompleted || (() => { }));
        socket.on("bill.closed", callbacks.onBillClosed || (() => { }));

        return () => {

            socket.emit("leaveRestaurant", { restaurantId });

            socket.off("bill.created");
            socket.off("bill.updated");
            socket.off("payment.completed");
            socket.off("bill.closed");
        };

    }, [restaurantId]);
}
