export const API = import.meta.env.VITE_API_URL || '/api';

/**
 * parseJson
 * Parses a fetch response as JSON.
 * Throws an error with the server message if the response is not OK.
 */
async function parseJson(response){ 
    if(!response.ok){
        try{
            const errorData = await response.json();
            throw new Error(errorData.error);
        } catch (error) {
            throw new Error('Request failed', error);
        }
    }
    return response.json();
}

/**
 * listOrders
 * Fetch all orders from the API and parse the response as JSON.
 */
export async function listOrders(){
    const response = await fetch(`${API}/orders`);
    return parseJson(response);
}

/**
 * createOrder
 * Send a new order to the API with a POST request.
 * Returns the parsed JSON response.
 */
export async function createOrder(order) {
    const response = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      
      return parseJson(response);
}

/**
 * deleteOrder
 * Send a DELETE request to remove an order by its ID.
 * Throws an error if the request fails, with details from the server if available.
 */
export async function deleteOrder(orderId){
    const res = await fetch(`${API}/orders/${orderId}`, { method: 'DELETE' });
    if (res.ok) return;
    let message = `Delete failed (HTTP ${res.status})`;
    try {
        const data = await res.json();
        if (data && typeof data.error === 'string' && data.error) {
          message = data.error;
        } else if (data && typeof data.message === 'string' && data.message) {
          message = data.message;
        }
      } catch (error) {
            console.warn('Failed to parse error JSON:', error);
      }
    
      throw new Error(message);
    
} 


