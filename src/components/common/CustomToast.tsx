type Props = {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
};

export default function CustomToast({ type, message, onClose }: Props) {
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
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderRadius: "14px",
        background: current.bg,
        border: `1px solid ${current.border}`,
        color: "#fff",
        minWidth: "420px",
        maxWidth: "520px",
        boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
      }}
    >
      {/* LEFT SIDE (ICON + TEXT PERFECTAMENTE ALINEADO) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flex: 1,
        }}
      >
        {/* ICON BOX FIJO (clave para alineación) */}
        <div
          style={{
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: current.border,
            color: "#000",
            fontSize: "14px",
            fontWeight: "bold",
            flexShrink: 0,
          }}
        >
          {current.icon}
        </div>

        {/* TEXTO ALINEADO */}
        <span
          style={{
            fontSize: "15px",
            fontWeight: 500,
            lineHeight: "20px",
          }}
        >
          {message}
        </span>
      </div>

      {/* CLOSE */}
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "#ccc",
          cursor: "pointer",
          fontSize: "18px",
          marginLeft: "10px",
        }}
      >
        ✕
      </button>
    </div>
  );
}
