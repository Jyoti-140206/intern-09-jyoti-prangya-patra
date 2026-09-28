import { useState, useRef } from 'react'
import Card from './Card'
import FieldLabel from './FieldLabel'

export default function UploadPrescription({ onUpload }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(null)
  const [meta, setMeta] = useState({ patientName: '', date: '', notes: '' })
  const inputRef = useRef()

  const handleMeta = (field) => (e) =>
    setMeta(prev => ({ ...prev, [field]: e.target.value }))

  const processFile = (f) => {
    if (!f) return
    if (f.size > 10 * 1024 * 1024) { alert('File exceeds 10MB'); return }
    setFile(f)
    if (f.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = e => setPreview(e.target.result)
      reader.readAsDataURL(f)
    } else { setPreview(null) }
  }

  const clearFile = (e) => {
    e?.stopPropagation()
    setFile(null); setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleUpload = () => {
    if (!file) { alert('Please select a file first'); return }
    setProgress(0)
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 18 + 5
      if (p >= 100) {
        clearInterval(iv)
        setTimeout(() => {
          onUpload({
            type: 'uploaded',
            patient: meta.patientName || 'Unknown Patient',
            date: meta.date || new Date().toISOString().split('T')[0],
            notes: meta.notes,
            fileName: file.name,
          })
          clearFile(); setMeta({ patientName: '', date: '', notes: '' }); setProgress(null)
        }, 400)
      }
      setProgress(Math.min(Math.round(p), 100))
    }, 120)
  }

  return (
    <Card>
      <div>
        <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--foreground)' }}>
          Upload Prescription
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: 2 }}>
          Upload an existing prescription image or PDF (max 10 MB)
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files[0]) }}
        style={{
          border: `2.5px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: '1rem',
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: file ? 'default' : 'pointer',
          background: isDragging ? 'rgba(34,197,94,0.06)' : '#f0fdf4',
          transition: 'all 0.2s',
        }}
      >
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp"
          style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />

        {!file ? (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📁</div>
            <p style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: '0.95rem' }}>
              Drag & drop file here, or click to browse
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', marginTop: '0.375rem' }}>
              Supports PDF, JPG, PNG, WEBP
            </p>
          </div>
        ) : (
          <div>
            {preview
              ? <img src={preview} style={{ maxHeight: 200, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', marginBottom: 12, maxWidth: '100%' }} alt="Preview" />
              : <div style={{ fontSize: '4rem', marginBottom: 8 }}>📄</div>}
            <p style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: '0.9rem' }}>{file.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: 2 }}>
              {(file.size / 1024).toFixed(1)} KB
            </p>
            <button onClick={clearFile} style={{
              marginTop: 12, fontSize: '0.75rem', padding: '4px 14px',
              borderRadius: 8, border: '1.5px solid var(--border)',
              color: 'var(--muted-foreground)', background: '#fff', cursor: 'pointer',
            }}>✕ Remove</button>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <FieldLabel>Patient Name</FieldLabel>
          <input type="text" placeholder="Linked patient name"
            value={meta.patientName} onChange={handleMeta('patientName')} />
        </div>
        <div>
          <FieldLabel>Prescription Date</FieldLabel>
          <input type="date" value={meta.date} onChange={handleMeta('date')} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <FieldLabel>Notes</FieldLabel>
          <textarea rows={2} placeholder="Any notes about this prescription..."
            value={meta.notes} onChange={handleMeta('notes')} />
        </div>
      </div>

      <button onClick={handleUpload} style={{
        width: '100%',
        padding: '0.75rem',
        borderRadius: '0.75rem',
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        color: '#fff',
        border: 'none',
        fontWeight: 700,
        fontSize: '0.9rem',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(34,197,94,0.35)',
      }}>
        ⬆️ Upload Prescription
      </button>

      {progress !== null && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem',
            color: 'var(--muted-foreground)', marginBottom: 4 }}>
            <span>Uploading...</span><span>{progress}%</span>
          </div>
          <div style={{ width: '100%', height: 8, borderRadius: 999, background: 'var(--accent)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 999,
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
              width: `${progress}%`,
              transition: 'width 0.3s',
            }} />
          </div>
        </div>
      )}
    </Card>
  )
}
