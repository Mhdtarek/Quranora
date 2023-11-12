<script>
  import Chart from 'svelte-frappe-charts';
  import { onMount } from 'svelte';
  import { getStatisticsFromIndexedDB } from "$lib/statistics";
  import { Badge, Group } from '@svelteuidev/core';

  let ayahsChartData = {
    labels: [],
    datasets: [
      {
        name: 'Ayahs',
        values: []
      }
    ]
  };

  let hasanatChartData = {
    labels: [],
    datasets: [
      {
        name: 'Hasanat',
        values: []
      }
    ]
  };

  let threeDaysStatistics = {
    hasanat: 0,
    versesRead: 0
  };

  async function fetchData() {
    try {
      const result = await getStatisticsFromIndexedDB("Statistics", "Ayahs", 3);

      if (result && result.dailyDetails) {
        const currentDate = new Date();
        // Generate the last 3 days labels
        const labels = Array.from({ length: 3 }, (_, index) => {
          const date = new Date(currentDate);
          date.setDate(date.getDate() - index);
          // Format date as needed, for example: 'Mon', 'Tues', etc.
          return date.toLocaleString('en-us', { weekday: 'short' });
        }).reverse();

        // Map the data to the correct day index for Ayahs chart
        ayahsChartData.labels = labels;
        ayahsChartData.datasets[0].values = labels.map(day => {
          const matchingDay = result.dailyDetails.find(item => item.date.includes(day));
          return matchingDay ? matchingDay.versesRead : 0;
        });

        // Map the data to the correct day index for Hasanat chart
        hasanatChartData.labels = labels;
        hasanatChartData.datasets[0].values = labels.map(day => {
          const matchingDay = result.dailyDetails.find(item => item.date.includes(day));
          return matchingDay ? matchingDay.hasanat : 0;
        });

        // Calculate 3-day statistics
        threeDaysStatistics.hasanat = result.dailyDetails.reduce((total, day) => total + day.hasanat, 0);
        threeDaysStatistics.versesRead = result.dailyDetails.reduce((total, day) => total + day.versesRead, 0);
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


<Group position="apart" spacing="md" class="error">
  <Badge color="yellow" size="lg" radius="xs">
    {threeDaysStatistics.hasanat} Hasanat
  </Badge>
  <Badge color="yellow" size="lg" radius="xs">
    {threeDaysStatistics.versesRead} Verses Read
  </Badge>
</Group>

<div>
  <h3>Ayahat Read (Last 3 Days)</h3>
  <Chart data={ayahsChartData} type="line" />
</div>

<div>
  <h3>Hasanat (Last 3 Days)</h3>
  <Chart data={hasanatChartData} type="line" />
</div>

