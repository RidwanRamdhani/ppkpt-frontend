export default function Checkbox({ label, id, checked, onChange, ...props }) {
  return <label htmlFor={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44 }}><input id={id} type="checkbox" checked={checked} onChange={onChange} {...props} /><span>{label}</span></label>
}
