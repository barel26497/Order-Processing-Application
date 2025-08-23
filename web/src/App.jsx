import { useOrders } from "./hooks/useOrdersService.js";
import OrderForm from "../components/OrderForm";
import OrderList from "../components/OrdersList";

/**
 * App
 * Root component of the Order Processing app.
 * Uses the useOrders hook to manage state and renders the form and list UI.
 */
export default function App() {
  const { orders, isLoading, errorMessage, addOrder, removeOrder, setError } =
    useOrders(2000);

  return (
    <main className="container">
      <header className="page-header">
        <div>
          <h1>Order Processing</h1>
          <p className="page-subtitle">Create an order</p>
        </div>
      </header>

      <section className="card">
        <OrderForm onCreate={addOrder} setGlobalError={setError} />
        {errorMessage && (
          <p className="error" role="alert">
            {errorMessage}
          </p>
        )}
      </section>

      <section className="card">
        <div className="section-header">
          <h2>Orders</h2>
          {!isLoading && <span className="muted">{orders.length} total</span>}
        </div>
        <OrderList
          orders={orders}
          isLoading={isLoading}
          onDelete={removeOrder}
        />
      </section>
    </main>
  );
}
