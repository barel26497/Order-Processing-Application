import { useState } from "react";
import style from "./OrderForm.module.css";

export default function OrderForm({ onCreate, setGlobalError }) {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submit, setSubmit] = useState(false);

  async function handleSubmit(event) {
    //Disable browser default behavior when submitting a form.
    event.preventDefault();

    //Ensures the UI doesn’t show old errors from a previous submit.
    setGlobalError("");

    try {
      setSubmit(true);
      await onCreate({ item, quantity });
      setItem("");
      setQuantity(1);
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setSubmit(false);
    }
  }

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <label className={style.label}>
        Item
        <input
          className={style.input}
          placeholder="Cola Zero"
          value={item}
          onChange={(event) => {
            setItem(event.target.value);
          }}
        />
      </label>

      <label className={style.label}>
        Quantity
        <input
          className={`${style.input} ${style.slim}`}
          type="number"
          min="1"
          value={quantity}
          onChange={(event) => {
            setQuantity(event.target.value);
          }}
        />
      </label>

      <button className={style.btn} type="submit" disabled={submit}>
        {submit ? "Ordering Items" : "Order"}
      </button>
    </form>
  );
}
