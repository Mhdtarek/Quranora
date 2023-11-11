<!--

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
          // Extract data for the chart
          chartData.datasets[0].values = result.dailyDetails.map(day => day.versesRead);
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
  
  <Chart {data=chartData} type="line" />
  
-->