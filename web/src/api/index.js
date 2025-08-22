export const API = import.meta.env.VITE_API_URL || '/api';

//Helper method for parsing JSON.
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

// Fetch all orders
export async function listOrders(){
    const response = await fetch(`${API}/orders`);
    return parseJson(response);
}

export async function createOrder(order) {
    const response = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      
      return parseJson(response);
}


