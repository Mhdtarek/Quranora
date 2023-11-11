<script>
  import { Button, Card, Group ,Badge } from '@svelteuidev/core';
  import { isDailyVerseLimitReached } from '$lib/db';
  import {getStatisticsFromIndexedDB} from "$lib/statistics"
  import WeeklyStatistics from "$lib/statistics/weeklyStatistics.svelte"

  let weeklyStatistics = {}
  let chart 

  getStatisticsFromIndexedDB("Statistics", "Ayahs", 7)
  .then((statistics) => {
    console.log("Statistics for the last 7 days:", statistics);
    weeklyStatistics = statistics.total
  })
  .catch((error) => {
    console.error(error);
  });

  const today = new Date();
  const day = today.toISOString().split("T")[0]; // Extract the date in "YYYY-MM-DD" format
  let versesReadToday = 0; // Default value
  let versesToRead = 10
  let dailyVerseLimit = localStorage.getItem("dailyVerseLimit") || 10


  if (localStorage.getItem(day) !== null) {
    versesReadToday = parseInt(localStorage.getItem(day));
  }  let showButton = true; 

  // Calculate the remaining verses to read using the provided functions
  if (isDailyVerseLimitReached()) {
    versesToRead = "Max amount read";
    showButton = false;
  } else {
    versesToRead = dailyVerseLimit - versesReadToday // Call the function to get the verses read today
    if (versesToRead <= 0) {
      showButton = false;
      versesToRead = "Max amount read";
    }
  }
</script>

<div style="margin-top: 20px; margin-bottom: 50px">
  <h1 style="text-align: center; margin-bottom: 20px;">Quranora</h1>
  <Card shadow='sm' padding='lg'>
    <Card.Section first padding='lg'>
      <h2 style="text-align: center;">Read</h2>
      {#if versesToRead === "Max amount read"}
      <p style="text-align: center;">You have read everything you need to but if you would like to read more then you can custom read</p>
      {:else}
      <p style="text-align: center;">You have {versesToRead} verses to read</p>
      {/if}
    </Card.Section>
    
    {#if showButton}
      <a href="/app/daily" data-sveltekit-preload-code="viewport">
        <Button variant='light' color='blue' fullSize>
          Daily read
        </Button>
      </a>
    {/if}
    <a href="/app/custom" data-sveltekit-preload-code="viewport">
      <Button variant='outline' color='blue' fullSize>
        Custom read
      </Button>
    </a>  
  </Card>

  <div class="statisticsCard">
    <Card> 
        <h2>Statistics</h2>
        <h5>For the last 7 days</h5>
        <Group position="apart" spacing="md" class="error">
          <Badge color="yellow" size="lg" radius="xs">
            {weeklyStatistics.hasanat} Hasanat
          </Badge>
          <Badge color="yellow" size="lg" radius="xs">
            {weeklyStatistics.versesRead} Verses Read
          </Badge>
        </Group>
        <a href="/app/statistics" style="margin-top: 5px; text-decoration: none; display: block" data-sveltekit-preload-code="viewport">
          <Button variant='outline' color='blue' compact>
            More Statistics
          </Button>
        </a> 
      <div style="margin-bottom: 50px;">
        <WeeklyStatistics />
      </div> 
    </Card>
  </div>
</div>
<style>
  .statisticsCard {
    margin-bottom: 80px;
    margin-top: 20px;
    text-align: center;
  }
</style>