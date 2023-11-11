<script>
  import Chart from 'svelte-frappe-charts';
  import { onMount } from 'svelte';
  import { getStatisticsFromIndexedDB } from "$lib/statistics";

  let chartData = {
    labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
    datasets: [
      {
        values: []
      }
    ]
  };

  async function fetchData() {
    try {
      const result = await getStatisticsFromIndexedDB("Statistics", "Ayahs", 7);

      if (result && result.dailyDetails) {
        // Create an object to map the days to their corresponding index
        const dayIndexMap = {
          'Sun': 0,
          'Mon': 1,
          'Tues': 2,
          'Wed': 3,
          'Thurs': 4,
          'Fri': 5,
          'Sat': 6,
        };

        // Map the data to the correct day index
        chartData.datasets[0].values = chartData.labels.map(day => {
          const matchingDay = result.dailyDetails.find(item => item.date.includes(day));
          return matchingDay ? matchingDay.versesRead : 0;
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Fetch data on component mount
  onMount(() => {
    fetchData();
  });
</script>

<style>
  /* Add any additional styling here */
</style>

<Chart data={chartData} type="line" />
