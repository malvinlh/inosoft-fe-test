import Button from '../common/Button';

export default function Toolbar({ search, onSearch, onExport, onCreate }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div></div>

      <div className="d-flex align-items-center gap-2">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <Button type="button" className="btn btn-outline-secondary" onClick={onExport}>
          Export
        </Button>
        <Button type="button" className="btn btn-primary" onClick={onCreate}>
          + Create Request
        </Button>
      </div>
    </div>
  );
}