import { useState } from "react";
import { Plus, Pencil, Trash2, Clock, CalendarDays, X, Pill, Search } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const initialSchedules = [
  {
    id: 1,
    medicine_name: "Metformin 500mg",
    dose: "1 tablet",
    time: "08:00",
    frequency: "Daily",
    day_of_week: null,
    start_date: "2026-06-01",
    end_date: null,
    is_active: true,
  },
  {
    id: 2,
    medicine_name: "Amlodipine 5mg",
    dose: "1 tablet",
    time: "20:30",
    frequency: "Daily",
    day_of_week: null,
    start_date: "2026-06-01",
    end_date: "2026-09-01",
    is_active: false,
  },
  {
    id: 3,
    medicine_name: "Vitamin D3 60K",
    dose: "1 capsule",
    time: "10:00",
    frequency: "Weekly",
    day_of_week: "Sunday",
    start_date: "2026-09-10",
    end_date: "2026-10-10",
    is_active: true,
  },
  {
    id: 4,
    medicine_name: "Methotrexate 15mg",
    dose: "1 tablet",
    time: "09:00",
    frequency: "2 times per week",
    day_of_week: "Monday, Thursday",
    start_date: "2026-09-01",
    end_date: null,
    is_active: true,
  },
];

function formatTime(value) {
  if (!value) return "";
  const [h, m] = value.split(":");
  const hour = Number(h);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${period}`;
}

const emptyForm = {
  medicine_name: "",
  dose: "",
  time: "08:00",
  frequency: "Daily",
  day_of_week: "Monday",
  days_selected: ["Monday", "Thursday"],
  start_date: new Date().toISOString().split("T")[0],
  end_date: "",
  is_active: true,
};

function ScheduleFormModal({ initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(() => {
    if (initialData) {
      const daysArr = initialData.day_of_week
        ? initialData.day_of_week.split(",").map((d) => d.trim())
        : ["Monday", "Thursday"];
      return {
        medicine_name: initialData.medicine_name ?? "",
        dose: initialData.dose ?? "",
        time: initialData.time ?? "08:00",
        frequency: initialData.frequency ?? "Daily",
        day_of_week: daysArr[0] || "Monday",
        days_selected: daysArr,
        start_date: initialData.start_date ?? "",
        end_date: initialData.end_date ?? "",
        is_active: initialData.is_active ?? true,
      };
    }
    return emptyForm;
  });

  const [errors, setErrors] = useState({});
  const isEdit = Boolean(initialData);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleToggleDay = (day) => {
    setForm((prev) => {
      let current = [...prev.days_selected];
      if (current.includes(day)) {
        if (current.length > 1) {
          current = current.filter((d) => d !== day);
        }
      } else {
        if (current.length >= 2) {
          // Replace the oldest selection to keep it at 2 days
          current = [current[1], day];
        } else {
          current.push(day);
        }
      }
      return { ...prev, days_selected: current };
    });
    setErrors((prev) => ({ ...prev, days_selected: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.medicine_name.trim()) next.medicine_name = "Enter a medicine name.";
    if (!form.dose.trim()) next.dose = "Enter a dose, e.g. 1 tablet.";
    if (!form.time) next.time = "Pick a time.";
    if (!form.start_date) next.start_date = "Pick a start date.";
    if (form.end_date && form.start_date && form.end_date < form.start_date) {
      next.end_date = "End date can't be before start date.";
    }
    if (form.frequency === "2 times per week" && form.days_selected.length < 2) {
      next.days_selected = "Please select exactly 2 days.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let computedDayOfWeek = null;
    if (form.frequency === "Weekly") {
      computedDayOfWeek = form.day_of_week;
    } else if (form.frequency === "2 times per week") {
      computedDayOfWeek = form.days_selected.join(", ");
    }

    onSubmit({
      medicine_name: form.medicine_name,
      dose: form.dose,
      time: form.time,
      frequency: form.frequency,
      day_of_week: computedDayOfWeek,
      start_date: form.start_date,
      end_date: form.end_date || null,
      is_active: form.is_active,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center p-0 sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:max-w-md sm:rounded-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            {isEdit ? "Edit schedule" : "Add schedule"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          {/* Medicine Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Medicine Name</label>
            <input
              type="text"
              placeholder="e.g. Metformin 500mg, Methotrexate"
              value={form.medicine_name}
              onChange={handleChange("medicine_name")}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-600/30 ${
                errors.medicine_name ? "border-red-400" : "border-slate-200"
              }`}
            />
            {errors.medicine_name && <p className="mt-1 text-xs text-red-600">{errors.medicine_name}</p>}
          </div>

          {/* Dose */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Dose</label>
            <input
              type="text"
              placeholder="e.g. 1 tablet, 1 capsule"
              value={form.dose}
              onChange={handleChange("dose")}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-600/30 ${
                errors.dose ? "border-red-400" : "border-slate-200"
              }`}
            />
            {errors.dose && <p className="mt-1 text-xs text-red-600">{errors.dose}</p>}
          </div>

          {/* Time */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Time</label>
            <input
              type="time"
              value={form.time}
              onChange={handleChange("time")}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-600/30 ${
                errors.time ? "border-red-400" : "border-slate-200"
              }`}
            />
            {errors.time && <p className="mt-1 text-xs text-red-600">{errors.time}</p>}
          </div>

          {/* Frequency (3 Options: Daily, Weekly, 2 times per week) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Frequency</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "Daily", label: "Daily" },
                { id: "Weekly", label: "Weekly (1x)" },
                { id: "2 times per week", label: "2x per week" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, frequency: opt.id }))}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors text-center ${
                    form.frequency === opt.id
                      ? "border-teal-600 bg-teal-50 text-teal-700 shadow-xs"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* If Weekly (1x): Select 1 day */}
          {form.frequency === "Weekly" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Day of week</label>
              <select
                value={form.day_of_week}
                onChange={handleChange("day_of_week")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-600/30"
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* If 2 times per week: Select 2 days */}
          {form.frequency === "2 times per week" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">Select 2 Days</label>
                <span className="text-xs text-teal-700 font-medium">
                  {form.days_selected.length}/2 selected
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {DAYS_SHORT.map((day, idx) => {
                  const fullDay = DAYS[idx];
                  const isSelected = form.days_selected.includes(fullDay);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleToggleDay(fullDay)}
                      className={`rounded-lg py-2 text-xs font-semibold transition ${
                        isSelected
                          ? "bg-teal-700 text-white shadow-xs"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Scheduled on:{" "}
                <span className="font-medium text-slate-800">
                  {form.days_selected.length > 0 ? form.days_selected.join(" & ") : "None chosen"}
                </span>
              </p>
              {errors.days_selected && (
                <p className="mt-1 text-xs text-red-600">{errors.days_selected}</p>
              )}
            </div>
          )}

          {/* Start and End Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Start date</label>
              <input
                type="date"
                value={form.start_date}
                onChange={handleChange("start_date")}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-600/30 ${
                  errors.start_date ? "border-red-400" : "border-slate-200"
                }`}
              />
              {errors.start_date && (
                <p className="mt-1 text-xs text-red-600">{errors.start_date}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">End date</label>
              <input
                type="date"
                value={form.end_date}
                onChange={handleChange("end_date")}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-600/30 ${
                  errors.end_date ? "border-red-400" : "border-slate-200"
                }`}
              />
              <p className="mt-1 text-xs text-slate-400">Optional</p>
            </div>
          </div>

          {/* Active status */}
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={handleChange("is_active")}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600/30"
            />
            Active schedule
          </label>

          {/* Submit/Cancel */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              {isEdit ? "Save changes" : "Add schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ScheduleCard({ schedule, onEdit, onDelete }) {
  const isActive = schedule.is_active;
  const name = schedule.medicine_name || "Medicine";

  return (
    <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <span
        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
          isActive ? "bg-teal-600" : "bg-slate-300"
        }`}
        title={isActive ? "Active" : "Inactive"}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold text-slate-900">{name}</span>
          <span className="text-sm text-slate-500">· {schedule.dose}</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-slate-400" />
            {formatTime(schedule.time)}
          </span>
          <span className="font-medium text-slate-700">
            {schedule.frequency}
            {schedule.day_of_week ? ` · ${schedule.day_of_week}` : ""}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">
          <CalendarDays size={13} />
          {schedule.start_date}
          {schedule.end_date ? ` – ${schedule.end_date}` : " – ongoing"}
        </div>
        <span
          className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            isActive ? "bg-teal-50 text-teal-700" : "bg-slate-100 text-slate-500"
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
          title="Edit schedule"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
          aria-label="Delete schedule"
          title="Delete schedule"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 px-6 py-14 text-center bg-white">
      <Pill className="h-10 w-10 text-slate-300 mb-2" />
      <p className="text-sm font-medium text-slate-700">No schedules added yet</p>
      <p className="mt-1 text-sm text-slate-400">
        Add a medicine schedule to organize your daily doses.
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

export default function MedicineSchedulePreview() {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const openAdd = () => {
    setEditingSchedule(null);
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditingSchedule(s);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSchedule(null);
  };

  const handleSubmit = (formData) => {
    if (editingSchedule) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === editingSchedule.id ? { ...s, ...formData } : s))
      );
    } else {
      setSchedules((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
    }
    closeModal();
  };

  const handleDelete = (schedule) => {
    const name = schedule.medicine_name || "this medicine";
    if (window.confirm(`Remove the ${formatTime(schedule.time)} schedule for ${name}?`)) {
      setSchedules((prev) => prev.filter((s) => s.id !== schedule.id));
    }
  };

  const filteredSchedules = schedules.filter((s) => {
    const name = (s.medicine_name || "").toLowerCase();
    const dose = (s.dose || "").toLowerCase();
    const freq = (s.frequency || "").toLowerCase();
    const days = (s.day_of_week || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || dose.includes(q) || freq.includes(q) || days.includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Daily Plan & Reminders</p>
            <h1 className="text-xl font-semibold text-slate-900">
              Medicine Schedules
            </h1>
          </div>
          <button
            onClick={openAdd}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-800 transition shadow-sm"
          >
            <Plus size={16} />
            Add schedule
          </button>
        </div>

        {/* Search Bar */}
        {schedules.length > 0 && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by medicine, dose, or frequency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            />
          </div>
        )}

        {/* List of Schedules */}
        {filteredSchedules.length === 0 ? (
          schedules.length === 0 ? (
            <EmptyState onAdd={openAdd} />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No schedules match "{searchQuery}".
            </div>
          )
        ) : (
          <ul className="space-y-3">
            {filteredSchedules.map((s) => (
              <ScheduleCard
                key={s.id}
                schedule={s}
                onEdit={() => openEdit(s)}
                onDelete={() => handleDelete(s)}
              />
            ))}
          </ul>
        )}

        {/* Modal */}
        {modalOpen && (
          <ScheduleFormModal
            initialData={editingSchedule}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
