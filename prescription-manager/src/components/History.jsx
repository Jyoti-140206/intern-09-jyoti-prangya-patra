import { useState } from 'react'
import Card from './Card'

export default function History({ records, onDelete }) {
  const [search, setSearch] = useState('')
  const filtered = records.filter(r =>
    r.patient.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      {/* Search Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--foreground)' }}>
          All Records <span style={{
            marginLeft: 8, fontSize: '0.75rem', fontWeight: 600,
            background: 'var(--accent)', color: 'var(--primary)',
            padding: '2px 10px', borderRadius: 999,
          }}>{records.length}</span>
        </p>
        <input type="text" placeholder="🔍  Search by patient..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '14rem', fontSize: '0.8rem' }} />
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>📭</div>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
            {records.length === 0
              ? 'No prescriptions yet. Create or upload one!'
              : 'No results match your search.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(rx => <RxCard key={rx.id} rx={rx} onDelete={onDelete} />)}
        </div>
      )}
    </Card>
  )
}

function RxCard({ rx, onDelete }) {
  const activeMeds = rx.meds?.filter(m => m.name) ?? []
  const isUploaded = rx.type === 'uploaded'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.875rem',
      padding: '1rem',
      borderRadius: '0.875rem',
      border: '1.5px solid var(--border)',
      background: '#fff',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(34,197,94,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Icon bubble */}
      <div style={{
        width: 44, height: 44, borderRadius: '0.75rem', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.3rem',
        background: isUploaded ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)',
      }}>
        {isUploaded ? '📎' : '📝'}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <p style={{ fontWeight: 600, fontSize: '0.925rem', color: 'var(--foreground)' }}>
            {rx.patient}
          </p>
          <span style={{
            fontSize: '0.7rem', fontWeight: 600,
            padding: '2px 10px', borderRadius: 999,
            background: isUploaded ? 'rgba(59,130,246,0.12)' : 'rgba(34,197,94,0.12)',
            color: isUploaded ? '#3b82f6' : '#16a34a',
          }}>
            {isUploaded ? 'Uploaded' : 'Created'}
          </span>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', marginTop: 3 }}>
          📅 {rx.date}
          {rx.fileName && <> · 📄 {rx.fileName}</>}
          {rx.diagnosis && <> · {rx.diagnosis}</>}
          {rx.doctor && <> · Dr. {rx.doctor}</>}
        </p>

        {activeMeds.length > 0 && (
          <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', marginTop: 3 }}>
            💊 {activeMeds.map(m => `${m.name}${m.dosage ? ` ${m.dosage}` : ''}`).join(', ')}
          </p>
        )}

        <p style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', marginTop: 3 }}>
          🕐 {rx.createdAt}
        </p>
      </div>

      <button onClick={() => onDelete(rx.id)} style={{
        color: 'var(--muted-foreground)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: 6,
        fontSize: '0.85rem',
        flexShrink: 0,
        transition: 'color 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-foreground)'}
        title="Delete"
      >✕</button>
    </div>
  )
}
