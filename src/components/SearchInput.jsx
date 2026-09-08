function SearchInput({ value, onChange, placeholder = 'Search...', style }) {
  return (
    <div className="ent-search" style={style}>
      <span className="ent-search-icon">🔍</span>
      <input
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchInput;