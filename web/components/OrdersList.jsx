import StatusTag from "./StatusTag.jsx";
import DeleteButton from "./DeleteButton.jsx";
import style from "./OrderList.module.css";

/**
 * OrderList
 * Renders a list of orders with their item, quantity, status, and timestamp.
 * Shows loading placeholders or an empty message when needed.
 * Includes a delete button for each order.
 */
export default function OrderList({ orders, isLoading, onDelete }) {
  if (isLoading) {
    return (
      <div className={style.placeholderList}>
        <div className={style.placeholder} />
        <div className={style.placeholder} />
        <div className={style.placeholder} />
      </div>
    );
  }

  if (orders.length === 0) {
    return <p className={style.faded}>No orders yet — create one above.</p>;
  }

  return (
    <ul className={style.list}>
      {orders.map((order) => {
        return (
          <li key={order.id} className={style.item}>
            <div className={style.main}>
              <span className={style.name} title={order.item}>
                {order.item}
              </span>
              <span className={style.quantity}>x {order.quantity}</span>
            </div>
            <div className={style.info}>
              <StatusTag status={order.status} />
              <time className={style.time} datetime={order.createdAt}>
                {new Date(order.createdAt).toLocaleString()}
              </time>
            </div>
            <div className={style.deleteButtonContainer}>
              <DeleteButton id={order.id} onDelete={onDelete} label="Delete" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
