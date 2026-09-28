import FieldLabel from './FieldLabel'

const FREQUENCIES = ['Once daily', 'Twice daily', 'Thrice daily', 'Every 4h', 'As needed']

export default function MedicationRow({ med, showRemove, onChange, onRemove }) {
  return (
    <div style={{
      padding: '0.875rem',
      borderRadius: '0.75rem',
      border: '1.5px solid var(--border)',
      background: '#f0fdf4',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '4fr 3fr 3fr 2fr', gap: '0.5rem' }}>
        <div>
          <FieldLabel>Medicine Name</FieldLabel>
          <input type="text" placeholder="e.g. Amoxicillin"
            value={med.name} onChange={e => onChange(med.id, 'name', e.target.value)} />
        </div>
        <div>
          <FieldLabel>Dosage</FieldLabel>
          <input type="text" placeholder="e.g. 500mg"
            value={med.dosage} onChange={e => onChange(med.id, 'dosage', e.target.value)} />
        </div>
        <div>
          <FieldLabel>Frequency</FieldLabel>
          <select value={med.frequency} onChange={e => onChange(med.id, 'frequency', e.target.value)}>
            {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <FieldLabel>Days</FieldLabel>
          <input type="number" min={1} placeholder="7"
            value={med.days} onChange={e => onChange(med.id, 'days', e.target.value)} />
        </div>
      </div>
      {showRemove && (
        <button onClick={() => onRemove(med.id)} style={{
          marginTop: '0.5rem',
          display: 'block',
          marginLeft: 'auto',
          fontSize: '0.75rem',
          color: '#ef4444',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 500,
        }}>✕ Remove</button>
      )}
    </div>
  )
}
