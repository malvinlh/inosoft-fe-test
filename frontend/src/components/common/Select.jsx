export default function Select({ value, onChange, children, ...rest }) {
  return (
    <select className="select" value={value} onChange={onChange} {...rest}>
      {children}
    </select>
  )
}