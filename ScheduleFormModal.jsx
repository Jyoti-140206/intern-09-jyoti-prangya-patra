// src/components/ScheduleFormModal.jsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const emptyForm = {
  medicine_name: "",
  dose: "",
  time: "08:00",
  frequency: "Daily",
  day_of_week: "Monday",
  start_date: new Date().toISOString().split("T")[0],
  end_date: "",
  is_active: true,
};

export default function ScheduleFormModal({ initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setForm({
        medicine_name: initialData.medicine_name ?? initialData.name ?? "",
        dose: initialData.dose ?? "",
        time: initialData.time ?? "08:00",
        frequency: initialData.frequency ?? "Daily",
        day_of_week: initialData.day_of_week ?? "Monday",
        start_date: initialData.start_date ?? "",
        end_date: initialData.end_date ?? "",
        is_active: initialData.is_active ?? true,
      });
    } else {
      setForm({
        ...emptyForm,
        start_date: new Date().toISOString().split("T")[0],
      });
    }
  }, [initialData]);

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.medicine_name?.trim()) next.medicine_name = "Enter a medicine name, e.g. Metformin 500mg.";
    if (!form.dose?.trim()) next.dose = "Enter a dose, e.g. 1 tablet.";
    if (!form.time) next.time = "Pick a time.";
    if (!form.start_date) next.start_date = "Pick a start date.";
    if (form.end_date && form.start_date && form.end_date < form.start_date) {
      next.end_date = "End date can't be before the start date.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        day_of_week: form.frequency === "Weekly" ? form.day_of_week : null,
        end_date: form.end_date || null,
      });
    } finally {
      setSubmitting(false);
    }
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
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Medicine Name
            </label>
            <input
              type="text"
              placeholder="e.g. Metformin 500mg, Amlodipine 5mg"
              value={form.medicine_name}
              onChange={handleChange("medicine_name")}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-600/30 ${
                errors.medicine_name ? "border-red-400" : "border-slate-200"
              }`}
            />
            {errors.medicine_name && (
              <p className="mt-1 text-xs text-red-600">{errors.medicine_name}</p>
            )}
          </div>

          {/* Dose */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Dose
            </label>
            <input
              type="text"
              placeholder="e.g. 1 tablet, 10ml"
              value={form.dose}
              onChange={handleChange("dose")}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-600/30 ${
                errors.dose ? "border-red-400" : "border-slate-200"
              }`}
            />
            {errors.dose && (
              <p className="mt-1 text-xs text-red-600">{errors.dose}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Time
            </label>
            <input
              type="time"
              value={form.time}
              onChange={handleChange("time")}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-600/30 ${
                errors.time ? "border-red-400" : "border-slate-200"
              }`}
            />
            {errors.time && (
              <p className="mt-1 text-xs text-red-600">{errors.time}</p>
            )}
          </div>

          {/* Frequency */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Frequency
            </label>
            <div className="flex gap-2">
              {["Daily", "Weekly","2x per week","3x per week"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, frequency: option }))
                  }
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    form.frequency === option
                      ? "border-teal-600 bg-teal-50 text-teal-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {form.frequency === "Weekly" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Day of week
              </label>
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

          {/* Start and End Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Start date
              </label>
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
              <label className="mb-1 block text-sm font-medium text-slate-700">
                End date
              </label>
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
              disabled={submitting}
              className="flex-1 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {isEdit ? "Save changes" : "Add schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
