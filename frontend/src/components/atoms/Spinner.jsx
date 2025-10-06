export default function Spinner({ label = 'Loading...', size = 'sm', className = '' }) {
  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      <div
        className={`spinner-border text-primary spinner-border-${size}`}
        role="status"
        aria-hidden="true"
      />
      <span className="text-muted">{label}</span>
    </div>
  )
}