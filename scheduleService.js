// src/services/scheduleService.js
//
// Schedule API calls, built on top of the shared axios instance in services/api.js.
// If your project already has src/services/api.js (per the Milestone 1 doc, section 11),
// just make sure it exports a configured axios instance as the default export and
// attaches the JWT to the Authorization header. This file assumes that instance exists.

import api from "./api";

// Adjust the base path here if the real Django route differs
// (e.g. /api/schedules/ vs /api/medicine-schedules/).
const BASE = "/api/schedules/";

export const getSchedules = (medicineId) =>
  api.get(BASE, { params: { medicine: medicineId } }).then((res) => res.data);

export const createSchedule = (medicineId, payload) =>
  api.post(BASE, { ...payload, medicine: medicineId }).then((res) => res.data);

export const updateSchedule = (scheduleId, payload) =>
  api.patch(`${BASE}${scheduleId}/`, payload).then((res) => res.data);

export const deleteSchedule = (scheduleId) =>
  api.delete(`${BASE}${scheduleId}/`).then((res) => res.data);
