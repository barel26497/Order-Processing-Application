import React from "react";
import style from "./DeleteButton.module.css";

/**
 * DeleteButton
 * Renders a button that asks for confirmation before deleting an order.
 * Disables itself while the delete action is in progress.
 */
export default function DeleteButton(props) {
  var [busy, setBusy] = React.useState(false);

  async function handleClick() {
    if (busy) return;
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      setBusy(true);
      await props.onDelete(props.id);
    } finally {
      setBusy(false);
    }
  }
  return (
    <button
      type="button"
      className={style.button}
      onClick={handleClick}
      disabled={busy}
      title={props.label}
    >
      {props.label}
    </button>
  );
}
