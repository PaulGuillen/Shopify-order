import "./../../styles/components/customers/serachBar.css";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function SearchBar({ search, setSearch }: Props) {
  return (
    <div className="filters-bar">
      <div className="filters-left">
        <input
          className="search-input"
          autoComplete="off"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
