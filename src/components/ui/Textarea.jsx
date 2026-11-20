export default function Textarea({ label, id, error, className = '', ...props }) {
  return <div className={className}>{label && <label htmlFor={id} style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>{label}</label>}<textarea id={id} className={`field ${error ? 'field-error' : ''}`} style={{ minHeight: 96, resize: 'vertical' }} {...props} />{error && <div className="error-text" role="alert">{error}</div>}</div>
}
