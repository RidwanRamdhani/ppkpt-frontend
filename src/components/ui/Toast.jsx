export default function Toast({ message, type = 'success' }) {
  if (!message) return null
  return <div role="status" style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 100, background: type === 'error' ? '#991b1b' : '#166534', color: 'white', borderRadius: 8, padding: '12px 16px', boxShadow: '0 10px 30px rgba(0,0,0,.15)' }}>{message}</div>
}
