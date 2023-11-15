<script>
  import Chart from 'svelte-frappe-charts';
  import { onMount } from 'svelte';
  import { getStatisticsFromIndexedDB } from "$lib/statistics";
  import { Badge, Group } from '@svelteuidev/core';

  export let showHasanat

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

  let weeklyStatistics = {
    hasanat: 0,
    versesRead: 0
  };

  async function fetchData() {
    try {
      const result = await getStatisticsFromIndexedDB("Statistics", "Ayahs", 7); // Fetch data for the last 7 days

      if (result && result.dailyDetails) {
        const currentDate = new Date();
        // Generate labels for the current week
        const labels = Array.from({ length: 7 }, (_, index) => {
          const date = new Date(currentDate);
          date.setDate(date.getDate() - (date.getDay() - 1) + index);
          // Format date as needed, for example: 'Mon', 'Tues', etc.
          return date.toLocaleString('en-us', { weekday: 'short' });
        });

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

        // Calculate weekly statistics
        weeklyStatistics.hasanat = result.dailyDetails.reduce((total, day) => total + day.hasanat, 0);
        weeklyStatistics.versesRead = result.dailyDetails.reduce((total, day) => total + day.versesRead, 0);
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
    {weeklyStatistics.hasanat} Hasanat
  </Badge>
  <Badge color="yellow" size="lg" radius="xs">
    {weeklyStatistics.versesRead} Verses Read
  </Badge>
</Group>

<div> 
  <h3>Ayahat Read</h3>
  <Chart data={ayahsChartData} type="line" />
</div>
{#if showHasanat === "true"}
<div>
  <h3>Hasanat</h3>
  <Chart data={hasanatChartData} type="line" />
</div>
{/if}
