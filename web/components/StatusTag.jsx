import style from "./StatusTag.module.css";

export default function StatusTag({ status }) {
  const cleanStatus = String(status || "").toLowerCase();
  let statusStyleType;
  if (cleanStatus === "pending") {
    statusStyleType = style.warning;
  } else if (cleanStatus === "processed") {
    statusStyleType = style.ok;
  } else {
    statusStyleType = style.fail;
  }
  return (
    <span className={`${style.statusTag} ${statusStyleType}`}>{status}</span>
  );
}
