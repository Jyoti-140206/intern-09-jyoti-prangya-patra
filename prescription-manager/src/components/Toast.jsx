export default function Toast({ message }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      color: '#fff',
      padding: '0.625rem 1.375rem',
      borderRadius: '0.875rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      boxShadow: '0 8px 24px rgba(34,197,94,0.4)',
      zIndex: 9999,
      whiteSpace: 'nowrap',
    }}>
      {message}
    </div>
  )
}
