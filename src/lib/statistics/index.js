import { readFromIndexedDB } from "$lib/db";
export function getStatisticsFromIndexedDB(
  dbName,
  objectStoreName,
  days = null
) {
  return new Promise((resolve, reject) => {
    readFromIndexedDB(dbName, objectStoreName)
      .then((allData) => {
        const dateStatisticsMap = new Map();

        // Group the data by date
        allData.forEach((item) => {
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

        // Filter by the specified number of days if provided
        const filteredStatistics = days
          ? sortedStatistics.slice(-days)
          : sortedStatistics;

        const statistics = {
          total: {
            versesRead: filteredStatistics.reduce(
              (sum, item) => sum + item.versesRead,
              0
            ),
            hasanat: filteredStatistics.reduce(
              (sum, item) => sum + item.hasanat,
              0
            ),
          },
          dailyDetails: filteredStatistics,
        };

        resolve(statistics);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function translateToChartData(statistics) {
  if (!statistics || !statistics.dailyDetails) {
    console.error("Invalid statistics data");
    return null;
  }

  const data = statistics.dailyDetails.map((item) => {
    return {
      label: item.date,
      value: item.versesRead, // Assuming versesRead is the relevant property
    };
  });

  return {
    chart: {
      caption: "Verses Read Per Day",
      subCaption: "In Number of Verses",
      xAxisName: "Date",
      yAxisName: "Verses Read",
      numberSuffix: "",
      theme: "fusion", // or any other theme you prefer
    },
    data: data,
  };
}
