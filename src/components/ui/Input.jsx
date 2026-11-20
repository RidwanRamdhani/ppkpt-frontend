export default function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label htmlFor={id} style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>{label}</label>}
      <input id={id} className={`field ${error ? 'field-error' : ''}`} {...props} />
      {error && <div className="error-text" role="alert">{error}</div>}
    </div>
  )
}
