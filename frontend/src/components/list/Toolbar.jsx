import Button from '../common/Button';

export default function Toolbar({ search, onSearch, onExport, onCreate }) {
  return (
    <div className="toolbar">
      <div className="left" />
      <div className="right">
        <div className="searchbox">
          <input placeholder="Search…" value={search} onChange={e=>onSearch(e.target.value)} />
          <span className="icon">🔍</span>
        </div>
        <Button type="button" onClick={onExport}>Export</Button>
        <Button type="button" onClick={onCreate}>+ Create Request</Button>
      </div>
    </div>
  );
}