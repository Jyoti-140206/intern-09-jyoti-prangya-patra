export default function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: '0.7rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      color: 'var(--primary)',
      marginBottom: '0.625rem',
    }}>
      {children}
    </p>
  )
}
