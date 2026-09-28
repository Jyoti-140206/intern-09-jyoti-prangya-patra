export default function Card({ children, className = '' }) {
  return (
    <div
      className={className}
      style={{
        background: '#ffffff',
        border: '1.5px solid var(--border)',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 2px 16px rgba(34,197,94,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {children}
    </div>
  )
}
