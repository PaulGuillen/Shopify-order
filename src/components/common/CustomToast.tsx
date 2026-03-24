import toast from "react-hot-toast";
import "../../styles/components/commons/customToast.css";


type Props = {
  type: "success" | "error" | "warning" | "info";
  message: string;
  toastId: string;
  duration?: number;
};

export default function CustomToast({
  type,
  message,
  toastId,
  duration = 4000,
}: Props) {
  const styles = {
    success: {
      bg: "#065f46",
      border: "#22c55e",
      icon: "✔",
    },
    error: {
      bg: "#450a0a",
      border: "#ef4444",
      icon: "✖",
    },
    warning: {
      bg: "#78350f",
      border: "#f59e0b",
      icon: "⚠",
    },
    info: {
      bg: "#0c4a6e",
      border: "#3b82f6",
      icon: "i",
    },
  };

  const current = styles[type];

  return (
    <div
      className={`toast-pro ${type}`}
      onClick={() => toast.dismiss(toastId)}
    >
      {/* CONTENT */}
      <div className="toast-content">
        <div
          className="toast-icon"
          style={{ background: current.border }}
        >
          {current.icon}
        </div>

        <span className="toast-message">{message}</span>
      </div>

      {/* PROGRESS BAR 🔥 */}
      <div
        className="toast-progress"
        style={{
          animationDuration: `${duration}ms`,
          background: current.border,
        }}
      />
    </div>
  );
}