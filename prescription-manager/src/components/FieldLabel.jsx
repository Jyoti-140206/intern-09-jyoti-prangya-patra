export default function FieldLabel({ children }) {
  return (
    <label
      className="block text-xs mb-1"
      style={{ color: 'var(--muted-foreground)' }}
    >
      {children}
    </label>
  )
}
