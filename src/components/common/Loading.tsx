import "../../styles/components/commons/loading.css";

interface Props {
  text?: string;
  fullscreen?: boolean;
}

export default function Loading({
  text = "Cargando...",
  fullscreen = false,
}: Props) {
  return (
    <div className={fullscreen ? "loading-overlay" : "loading-container"}>
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}
