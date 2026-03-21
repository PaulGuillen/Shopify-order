import "../../styles/components/statusSelectorModal.css";

type Option = {
  label: string;
  color: string;
};

type Props = {
  title: string;
  options: Option[];
  onSelect: (value: string) => void;
  onClose: () => void;
};

export default function StatusSelectorModal({
  title,
  options,
  onSelect,
  onClose,
}: Props) {
  return (
    <div className="selector-overlay" onClick={onClose}>
      <div className="selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="selector-header">
          <h3>{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="selector-content">
          {options.map((opt) => (
            <div
              key={opt.label}
              className={`selector-item ${opt.color}`}
              onClick={() => onSelect(opt.label)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
