import { readFromIndexedDB } from "$lib/db";
export function getStatisticsFromIndexedDB(
  dbName,
  objectStoreName,
  days = null
) {
  return new Promise((resolve, reject) => {
    readFromIndexedDB(dbName, objectStoreName)
      .then((allData) => {
        const currentDate = new Date();
        const cutoffDate = new Date();
        cutoffDate.setDate(currentDate.getDate() - (days || 0));

        const filteredData = allData.filter(
          (item) => new Date(item.date) >= cutoffDate
        );

        const dateStatisticsMap = new Map();

        // Group the data by date
        filteredData.forEach((item) => {
          const dateKey = new Date(item.date).toDateString(); // Convert to date string
          const existingEntry = dateStatisticsMap.get(dateKey);

          if (existingEntry) {
            existingEntry.versesRead += 1; // Assuming each record represents a verse read
            existingEntry.hasanat += item.hasanat;
          } else {
            dateStatisticsMap.set(dateKey, {
              date: dateKey,
              versesRead: 1,
              hasanat: item.hasanat,
            });
          }
        });

        // Convert the Map to an array and sort by date
        const sortedStatistics = Array.from(dateStatisticsMap.values()).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        const statistics = {
          total: {
            versesRead: sortedStatistics.reduce(
              (sum, item) => sum + item.versesRead,
              0
            ),
            hasanat: sortedStatistics.reduce(
              (sum, item) => sum + item.hasanat,
              0
            ),
          },
          dailyDetails: sortedStatistics,
        };

        resolve(statistics);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
