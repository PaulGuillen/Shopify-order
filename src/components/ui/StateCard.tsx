import "../../styles/pages/homePage.css";

type Props = {
  title: string;
  value: string;
  change: string;
  changeType?: "up" | "down";
  note?: string;
};

export default function StatCard({
  title,
  value,
  change,
  changeType = "up",
  note,
}: Props) {
  return (
    <div className="card">
      <div className="card-head">
        <p className="card-title">{title}</p>
        <span className={`pill ${changeType}`}>{change}</span>
      </div>

      <div className="card-value">{value}</div>

      {note ? <div className="card-note">{note}</div> : null}
    </div>
  );
}
