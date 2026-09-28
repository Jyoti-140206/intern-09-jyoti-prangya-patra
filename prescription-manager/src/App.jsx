import { useState } from 'react'
import NewPrescription from './components/NewPrescription'
import UploadPrescription from './components/UploadPrescription'
import History from './components/History'
import Toast from './components/Toast'

const TABS = [
  { id: 'new',     icon: '✍️', label: 'New Prescription' },
  { id: 'upload',  icon: '📎', label: 'Upload Prescription' },
  { id: 'history', icon: '📋', label: 'History' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('new')
  const [records, setRecords] = useState([])
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const addRecord = (record) => {
    setRecords(prev => [
      { ...record, id: Date.now(), createdAt: new Date().toLocaleString() },
      ...prev,
    ])
  }

  const deleteRecord = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id))
    showToast('🗑️ Removed')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--background)' }}>

      {/* ── Top Nav Bar ── */}
      <header style={{
        background: 'var(--primary)',
        color: '#fff',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        height: '64px',
        boxShadow: '0 2px 12px rgba(34,197,94,0.25)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem',
        }}>💊</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.01em' }}>
            Prescription Manager
          </div>
          <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>
            Digital Doctor's Portal
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 999,
            padding: '4px 14px',
            fontSize: '0.78rem',
            fontWeight: 600,
          }}>🩺 Dr. Portal</div>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', cursor: 'pointer',
          }}>👤</div>
        </div>
      </header>

      {/* ── Layout: Sidebar + Main ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside style={{
          width: 220,
          background: '#ffffff',
          borderRight: '1.5px solid var(--border)',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          flexShrink: 0,
        }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--muted-foreground)', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
            Menu
          </p>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.6rem 0.875rem',
                borderRadius: '0.625rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontSize: '0.875rem',
                transition: 'all 0.15s',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--foreground)',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(34,197,94,0.3)' : 'none',
              }}>
              <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}

          {/* Stats */}
          <div style={{ marginTop: 'auto' }}>
            <div style={{
              background: 'var(--accent)',
              borderRadius: '0.75rem',
              padding: '0.875rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                {records.length}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
                Total Records
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '0.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#22c55e' }}>
                    {records.filter(r => r.type === 'created').length}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)' }}>Created</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#3b82f6' }}>
                    {records.filter(r => r.type === 'uploaded').length}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)' }}>Uploaded</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
          background: 'var(--background)',
        }}>
          {/* Page Title */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--foreground)' }}>
              {TABS.find(t => t.id === activeTab)?.icon}{' '}
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: 2 }}>
              {activeTab === 'new'     && 'Fill in the details to create a new prescription'}
              {activeTab === 'upload'  && 'Upload an existing prescription document'}
              {activeTab === 'history' && 'Browse and manage all prescription records'}
            </p>
          </div>

          {/* Panels */}
          {activeTab === 'new' && (
            <NewPrescription onSave={(rx) => { addRecord(rx); showToast('✅ Prescription saved!') }} />
          )}
          {activeTab === 'upload' && (
            <UploadPrescription onUpload={(rx) => { addRecord(rx); showToast('✅ Prescription uploaded!') }} />
          )}
          {activeTab === 'history' && (
            <History records={records} onDelete={deleteRecord} />
          )}
        </main>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  )
}
