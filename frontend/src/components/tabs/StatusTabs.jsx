export default function StatusTabs({ active, onChange }) {
  const tabs = ['Open','For Review','Completed']
  return (
    <div className="tabs">
      {tabs.map(t => (
        <button
          key={t}
          className={`tab ${active===t?'active':''}`}
          onClick={()=>onChange(t)}
        >{t}</button>
      ))}
    </div>
  )
}