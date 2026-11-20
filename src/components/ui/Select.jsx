export default function Select({ label, id, error, children, className = '', ...props }) {
  return <div className={className}>{label && <label htmlFor={id} style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>{label}</label>}<select id={id} className={`field ${error ? 'field-error' : ''}`} {...props}>{children}</select>{error && <div className="error-text" role="alert">{error}</div>}</div>
}
