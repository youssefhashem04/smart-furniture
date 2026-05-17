import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Toast() {
  const { toast } = useContext(CartContext);
  if (!toast) return null;
  return <div className="toast">{toast}</div>;
}

export default Toast;