export default function Button({ 
  children, 
  variant = 'primary',
  size = '',
  className = '',
  ...rest 
}) {
  return (
    <button 
      className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`} 
      {...rest}
    >
      {children}
    </button>
  );
}