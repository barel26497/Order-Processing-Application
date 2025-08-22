import StatusTag from "./StatusTag.jsx";
import style from "./OrderList.module.css";

export default function OrderList({ orders, isLoading }) {
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
          </li>
        );
      })}
    </ul>
  );
}
