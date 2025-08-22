import { useEffect, useRef, useState } from 'react';
import { listOrders, createOrder } from '../api/index.js';

export function useOrders(pollIntervalMs = 2500) {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const intervalRef = useRef(null);

    // Fetch all orders from the backend API and update state.
    async function fetchOrders(){
        try{
            const data = await listOrders();
            setOrders(data);
            setErrorMessage('');
        } catch (error){
            if (error && error.message) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('Failed to fetch');
            }
        } finally {
            setIsLoading(false);
        }
    }

    // Add a new order by sending item and quantity to the backend.
    async function addOrder({ item, quantity }){ 
        const quantityNum = Number(quantity);

        if (!item || !item.trim()) {
            throw new Error('Item is required');
        }
      
        if (!Number.isInteger(quantityNum) || quantityNum <= 0) {
            throw new Error('Quantity must be an integer > 0');
        }
      
        await createOrder({ item: item.trim(), quantity: quantityNum });
        await fetchOrders();
    }

    // Effect to start and stop polling orders at a given interval.
    useEffect(function setupPolling() {
        function startPolling() {
            if (intervalRef.current) return;
            fetchOrders();
            intervalRef.current = setInterval(fetchOrders, pollIntervalMs);
        }

        function stopPolling() {
            if (!intervalRef.current) return;
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        function handleVisibilityChange() {
            if (document.hidden) {
                stopPolling();
            } else {
                startPolling();
            }
        }

        startPolling();
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return function cleanup() {
            stopPolling();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [pollIntervalMs]);

    return {
        orders,
        isLoading,
        errorMessage,
        refresh: fetchOrders,
        addOrder,
        setError: setErrorMessage,
    };
}

