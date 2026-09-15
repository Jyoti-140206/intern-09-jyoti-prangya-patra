// src/pages/MedicineSchedule.jsx
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Clock, CalendarDays } from "lucide-react";
import ScheduleFormModal from "../components/ScheduleFormModal";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../services/scheduleService";

function formatTime(value) {
  if (!value) return "";
  const [h, m] = value.split(":");
  const hour = Number(h);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${period}`;
}

export default function MedicineSchedule({ medicineId, medicineName }) {
  const [schedules, setSchedules] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadSchedules = async () => {
    setStatus("loading");
    try {
      const data = await getSchedules(medicineId);
      setSchedules(data);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    loadSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicineId]);

  const openAddModal = () => {
    setEditingSchedule(null);
    setModalOpen(true);
  };

  const openEditModal = (schedule) => {
    setEditingSchedule(schedule);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSchedule(null);
  };

  const handleSubmit = async (formData) => {
    if (editingSchedule) {
      const updated = await updateSchedule(editingSchedule.id, formData);
      setSchedules((prev) =>
        prev.map((s) => (s.id === editingSchedule.id ? updated : s))
      );
    } else {
      const created = await createSchedule(medicineId, formData);
      setSchedules((prev) => [...prev, created]);
    }
    closeModal();
  };

  const handleDelete = async (schedule) => {
    const confirmed = window.confirm(
      `Remove the ${formatTime(schedule.time)} schedule for ${
        medicineName || "this medicine"
      }?`
    );
    if (!confirmed) return;

    setDeletingId(schedule.id);
    try {
      await deleteSchedule(schedule.id);
      setSchedules((prev) => prev.filter((s) => s.id !== schedule.id));
    } catch (err) {
      window.alert("Couldn't delete this schedule. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Schedule for</p>
          <h1 className="text-xl font-semibold text-slate-900">
            {medicineName || "Medicine"}
          </h1>
        </div>
        <button
          onClick={openAddModal}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          <Plus size={16} />
          Add schedule
        </button>
      </div>

      {status === "loading" && <LoadingState />}
      {status === "error" && <ErrorState onRetry={loadSchedules} />}
      {status === "ready" && schedules.length === 0 && (
        <EmptyState onAdd={openAddModal} />
      )}
      {status === "ready" && schedules.length > 0 && (
        <ul className="space-y-3">
          {schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              medicineName={medicineName}
              deleting={deletingId === schedule.id}
              onEdit={() => openEditModal(schedule)}
              onDelete={() => handleDelete(schedule)}
            />
          ))}
        </ul>
      )}

      {modalOpen && (
        <ScheduleFormModal
          initialData={editingSchedule}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function ScheduleCard({ schedule, medicineName, deleting, onEdit, onDelete }) {
  const isActive = schedule.is_active;

  return (
    <li
      className={`flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm ${
        deleting ? "opacity-50" : ""
      }`}
    >
      <span
        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
          isActive ? "bg-teal-600" : "bg-slate-300"
        }`}
        title={isActive ? "Active" : "Inactive"}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-medium text-slate-900">
            {medicineName || "Medicine"}
          </span>
          <span className="text-sm text-slate-500">· {schedule.dose}</span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-slate-400" />
            {formatTime(schedule.time)}
          </span>
          <span>
            {schedule.frequency}
            {schedule.frequency === "Weekly" && schedule.day_of_week
              ? ` · ${schedule.day_of_week}`
              : ""}
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">
          <CalendarDays size={13} />
          {schedule.start_date}
          {schedule.end_date ? ` – ${schedule.end_date}` : " – ongoing"}
        </div>

        <span
          className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            isActive
              ? "bg-teal-50 text-teal-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex shrink-0 gap-1">
        <button
          onClick={onEdit}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-teal-700"
          aria-label="Edit schedule"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          aria-label="Delete schedule"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}

function LoadingState() {
  return (
    <ul className="space-y-3">
      {[1, 2, 3].map((i) => (
        <li
          key={i}
          className="h-24 animate-pulse rounded-xl border border-slate-100 bg-slate-50"
        />
      ))}
    </ul>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 px-6 py-14 text-center">
      <p className="text-sm font-medium text-slate-700">
        No schedules added yet
      </p>
      <p className="mt-1 text-sm text-slate-400">
        Add a schedule so this medicine shows up in the daily plan.
      </p>
      <button
        onClick={onAdd}
        className="mt-4 flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
      >
        <Plus size={16} />
        Add schedule
      </button>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-red-100 bg-red-50 px-6 py-10 text-center">
      <p className="text-sm font-medium text-red-700">
        Couldn't load the schedule
      </p>
      <p className="mt-1 text-sm text-red-500">
        Check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Retry
      </button>
    </div>
  );
}
