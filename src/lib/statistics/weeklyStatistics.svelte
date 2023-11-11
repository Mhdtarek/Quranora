<script>
  import * as Pancake from '@sveltejs/pancake';
  import { getStatisticsFromIndexedDB } from "$lib/statistics";

  let x1 = +Infinity;
  let x2 = -Infinity;
  let y1 = +Infinity;
  let y2 = -Infinity;

  let closest;

  let dailyDetails = [];

  // Fetch data from IndexedDB for the last 7 days
  async function fetchData() {
    try {
      // Assuming getStatisticsFromIndexedDB returns an object with dailyDetails
      const result = await getStatisticsFromIndexedDB("Statistics", "Ayahs", 7);
      
      if (result && result.dailyDetails) {
        dailyDetails = result.dailyDetails;

        // Calculate chart bounds
        dailyDetails.forEach(d => {
          if (d.versesRead < x1) x1 = d.versesRead;
          if (d.versesRead > x2) x2 = d.versesRead;
          if (d.hasanat < y1) y1 = d.hasanat;
          if (d.hasanat > y2) y2 = d.hasanat;
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  fetchData();

  $: points = dailyDetails.map(d => ({
    x: d.versesRead,
    y: d.hasanat,
    data: d
  }));
</script>

<div class="chart">
  <Pancake.Chart {x1} {x2} y1={y1} y2={y2}>
    <Pancake.Svg>
      <Pancake.SvgLine data={dailyDetails} let:d>
        <path class="data" d="M {d.versesRead} {d.hasanat}"></path>
      </Pancake.SvgLine>

      {#if closest}
        <Pancake.SvgLine data={closest.data} let:d>
          <path class="highlight" d="M {d.versesRead} {d.hasanat}"></path>
        </Pancake.SvgLine>
      {/if}
    </Pancake.Svg>

    {#if closest}
      <Pancake.Point x={closest.data.versesRead} y={closest.data.hasanat}>
        <span class="annotation-point"></span>
        <div class="annotation" style="transform: translate(-{100 * ((closest.data.versesRead - x1) / (x2 - x1))}%,0)">
          <strong>{closest.data.date}</strong>
          <span>Verses Read: {closest.data.versesRead}, Hasanat: {closest.data.hasanat}</span>
        </div>
      </Pancake.Point>
    {/if}

    <Pancake.Quadtree data={points} bind:closest/>
  </Pancake.Chart>
</div>

<style>
  /* The rest of your styling remains unchanged */
</style>
