export default function Select({ value, onChange, children, className = '', ...rest }) {
  return (
    <select
      className={`form-select ${className}`}
      value={value}
      onChange={onChange}
      {...rest}
    >
      {children}
    </select>
  )
}