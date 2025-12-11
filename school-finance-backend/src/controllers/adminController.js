import {
  getTotalCollectedToday,
  getTotalCollectedThisMonth,
  getPendingSessionsCount,
  getUnpaidStudentsCount
} from "../models/adminModel.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const today = await getTotalCollectedToday();
    const month = await getTotalCollectedThisMonth();
    const pending = await getPendingSessionsCount();
    const unpaid = await getUnpaidStudentsCount();

    
    res.json({
      message: "Dashboard summary loaded",
      summary: {
        today,
        month,
        pending,
        unpaid
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
