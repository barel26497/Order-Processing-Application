import { useEffect, useRef, useState } from 'react';
import { listOrders, createOrder, deleteOrder } from '../api/index.js';

/**
 * useOrders
 * Custom React hook to manage orders with polling.
 * Provides fetching, creating, and deleting orders, plus error handling.
 * Returns an object with orders, loading state, error message, and helper methods.
 */
export function useOrders(pollIntervalMs = 2000) {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const intervalRef = useRef(null);

    /**
     * fetchOrders
     * Fetch all orders from the API and update local state.
     * Clears error messages on success, sets error state on failure.
     */
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

    /**
     * addOrder
     * Validate item and quantity before creating a new order.
     * Calls the API and refreshes the order list after success.
     */
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

    /**
     * removeOrder
     * Remove an order from state, then call the API to delete it.
     * Restarts polling whether the delete succeeds or fails, and updates errors if needed.
     */
    async function removeOrder(id){
        // remove the order with matching id
        setOrders(prev => prev.filter(Object => Object.id != id));

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        try{
            await deleteOrder(id);
            // Restart polling by clearing and setting new interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = setInterval(fetchOrders, pollIntervalMs);
        } catch (error){
            console.error('[Orders] delete failed:', error);
            let msg = 'Failed to delete order';
            if( error instanceof Error && error.message) {
                msg = error.message;
            }
            setErrorMessage(msg);
            await fetchOrders();
            
            // Restart polling after an error
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = setInterval(fetchOrders, pollIntervalMs);
        }
    }

    /**
     * setupPolling
     * Starts polling orders at a fixed interval.
     * Pauses when the tab is hidden and restarts when visible again.
     */
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
        removeOrder,
        setError: setErrorMessage,
    };
}

