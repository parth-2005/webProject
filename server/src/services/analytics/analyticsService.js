import { APPOINTMENT_STATUS } from "shared/constants/appointmentStatus.js";

import { Appointment } from "../../models/Appointment.model.js";

/**
 * Build analytics summary for a date window.
 * @param {{ from?: string, to?: string }} params
 * @returns {Promise<{ totalAppointments: number, noShowRate: number, repeatPatients: number, dailyTrends: Array<{ date: string, count: number }> }>}
 */
export async function getAnalyticsSummary({ from, to }) {
  const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const toDate = to ? new Date(to) : new Date();

  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);

  const baseMatch = { date: { $gte: fromDate, $lte: toDate } };

  const [totalAppointments, noShows, repeatPatientsAgg, dailyTrendAgg] = await Promise.all([
    Appointment.countDocuments(baseMatch),
    Appointment.countDocuments({ ...baseMatch, status: APPOINTMENT_STATUS.NO_SHOW }),
    Appointment.aggregate([
      { $match: baseMatch },
      { $group: { _id: "$patientId", visits: { $sum: 1 } } },
      { $match: { visits: { $gt: 1 } } },
      { $count: "count" },
    ]),
    Appointment.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]),
  ]);

  const repeatPatients = repeatPatientsAgg[0]?.count || 0;
  const noShowRate = totalAppointments === 0 ? 0 : Number(((noShows / totalAppointments) * 100).toFixed(2));

  const dailyTrends = dailyTrendAgg.map((item) => {
    const y = String(item._id.year);
    const m = String(item._id.month).padStart(2, "0");
    const d = String(item._id.day).padStart(2, "0");
    return { date: `${y}-${m}-${d}`, count: item.count };
  });

  return {
    totalAppointments,
    noShowRate,
    repeatPatients,
    dailyTrends,
  };
}