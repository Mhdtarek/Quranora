<script>
  import { Badge, Button, Card, Group, Image, Text } from '@svelteuidev/core';
  import { isDailyVerseLimitReached } from '$lib/db';
  import {getStatisticsFromIndexedDB} from "$lib/statistics"
  import WeeklyStatistics from "$lib/statistics/weeklyStatistics.svelte"

  let weeklyStatistics = {}
  let chart 

  getStatisticsFromIndexedDB("Statistics", "Ayahs", 7)
  .then((statistics) => {
    console.log("Statistics for the last 7 days:", statistics);
    weeklyStatistics = statistics
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
<div style="margin-top: 20px;">
  <h1 style="text-align: center; margin-bottom: 20px;">Quranora</h1>
  <Card shadow='sm' padding='lg'>
    <Card.Section first padding='lg'>
      <h2 style="text-align: center;">Daily Read</h2>
      {#if versesToRead === "Max amount read"}
      <p style="text-align: center;">Nothing to read for today </p>
      {:else}
      <p style="text-align: center;">You have {versesToRead} verses to read</p>
      {/if}
    </Card.Section>
    
    {#if showButton}
    <a href="/app/daily" data-sveltekit-preload-code="viewport">
      <Button variant='light' color='blue' fullSize>
        Start reading
      </Button>
    </a>
    {/if}
  </Card>
<div class="customCard">
    <Card shadow='sm' padding='lg'>
      <Card.Section first padding='lg'>
        <h2 style="text-align: center;">Custom Read</h2>
      </Card.Section>
      <a href="/app/custom" data-sveltekit-preload-code="viewport">
        <Button variant='outline' color='blue' fullSize>
          Start custom read
        </Button>
      </a>
    </Card>
  </div>
  <WeeklyStatistics />
</div>
<style>
  .customCard {
    margin-top: 20px;
  }
</style>