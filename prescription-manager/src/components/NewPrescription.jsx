import { useState } from 'react'
import Card from './Card'
import SectionLabel from './SectionLabel'
import FieldLabel from './FieldLabel'
import MedicationRow from './MedicationRow'

const EMPTY_FORM = {
  patientName: '', dob: '', gender: '', phone: '',
  diagnosis: '', doctor: '',
  date: new Date().toISOString().split('T')[0],
  notes: '',
}

const EMPTY_MED = () => ({
  id: Date.now() + Math.random(),
  name: '', dosage: '', frequency: 'Once daily', days: '',
})

export default function NewPrescription({ onSave }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [meds, setMeds] = useState([EMPTY_MED()])

  const handleChange = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const addMed    = () => setMeds(prev => [...prev, EMPTY_MED()])
  const removeMed = (id) => setMeds(prev => prev.filter(m => m.id !== id))
  const updateMed = (id, field, value) =>
    setMeds(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))

  const handleSave = () => {
    onSave({ type: 'created', patient: form.patientName || 'Unknown Patient', ...form, meds })
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().split('T')[0] })
    setMeds([EMPTY_MED()])
  }

  const handleClear = () => {
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().split('T')[0] })
    setMeds([EMPTY_MED()])
  }

  return (
    <Card>
      {/* Patient Info */}
      <div>
        <SectionLabel>👤 Patient Information</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <input type="text" placeholder="e.g. John Smith"
              value={form.patientName} onChange={handleChange('patientName')} />
          </div>
          <div>
            <FieldLabel>Date of Birth</FieldLabel>
            <input type="date" value={form.dob} onChange={handleChange('dob')} />
          </div>
          <div>
            <FieldLabel>Gender</FieldLabel>
            <select value={form.gender} onChange={handleChange('gender')}>
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <FieldLabel>Phone Number</FieldLabel>
            <input type="tel" placeholder="+91 00000 00000"
              value={form.phone} onChange={handleChange('phone')} />
          </div>
        </div>
      </div>

      <Divider />

      {/* Diagnosis */}
      <div>
        <SectionLabel>🏥 Diagnosis</SectionLabel>
        <textarea rows={2} placeholder="Enter diagnosis or clinical notes..."
          value={form.diagnosis} onChange={handleChange('diagnosis')} />
      </div>

      <Divider />

      {/* Medications */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <SectionLabel>💊 Medications</SectionLabel>
          <button onClick={addMed} style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
          }}>+ Add Medicine</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {meds.map(med => (
            <MedicationRow key={med.id} med={med}
              showRemove={meds.length > 1}
              onChange={updateMed} onRemove={removeMed} />
          ))}
        </div>
      </div>

      <Divider />

      {/* Doctor & Date */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <FieldLabel>Prescribing Doctor</FieldLabel>
          <input type="text" placeholder="Dr. Name" value={form.doctor} onChange={handleChange('doctor')} />
        </div>
        <div>
          <FieldLabel>Prescription Date</FieldLabel>
          <input type="date" value={form.date} onChange={handleChange('date')} />
        </div>
      </div>

      {/* Notes */}
      <div>
        <FieldLabel>Additional Notes / Instructions</FieldLabel>
        <textarea rows={2} placeholder="e.g. Take after meals, avoid alcohol..."
          value={form.notes} onChange={handleChange('notes')} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
        <button onClick={handleSave} style={{
          flex: 1,
          padding: '0.7rem',
          borderRadius: '0.75rem',
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          color: '#fff',
          border: 'none',
          fontWeight: 700,
          fontSize: '0.9rem',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(34,197,94,0.35)',
          transition: 'opacity 0.2s',
        }}>
          💾 Save Prescription
        </button>
        <button onClick={handleClear} style={{
          padding: '0.7rem 1.25rem',
          borderRadius: '0.75rem',
          background: 'transparent',
          border: '1.5px solid var(--border)',
          color: 'var(--muted-foreground)',
          fontWeight: 500,
          fontSize: '0.875rem',
          cursor: 'pointer',
        }}>
          Clear
        </button>
      </div>
    </Card>
  )
}

function Divider() {
  return <hr style={{ borderColor: 'var(--border)', borderTopWidth: '1.5px' }} />
}
