<script>
  import {
    startReading,
    readNextVerse,
  } from '$lib'; // Import the actual functions from $lib
  import {isDailyVerseLimitReached} from "$lib/db"
  import { Badge, Group, Card, Button  } from '@svelteuidev/core';

  let userId = 'user123'; // Replace with the actual user ID
  let chapter = 1;
  let verse = 1;
  let dailyVerseLimit = localStorage.getItem("dailyVerseLimit") || 10

  let currentVerse = "1:1"
  let verseText;
  let translationText;
  let hasanat;
  let versesReadToday = 0
  let message;
  
  // Function to initialize reading progress
  async function initReading() {
    const readingProgress = await startReading(userId, chapter, verse, dailyVerseLimit);
    currentVerse = readingProgress.currentVerse;
    verseText = readingProgress.verseText;
    translationText = readingProgress.translationText
    hasanat = readingProgress.hasanat;
    versesReadToday = readingProgress.versesReadToday;
    message = "Go"
  }

  // Function to read the next verse
  async function nextVerse() {
    console.log(currentVerse)
    const result = await readNextVerse(userId, currentVerse, dailyVerseLimit);
    console.log("res", result)
    currentVerse = result.currentVerse;
    verseText = result.verseText;
    translationText = result.translationText

    hasanat = result.hasanat;
    message = result.message
    versesReadToday = result.versesReadToday;

    console.log(isDailyVerseLimitReached())
  }
  initReading()
</script>

<main>
  {#if versesReadToday < dailyVerseLimit}
    <div class="group">
      <Group position="apart" spacing="md" class="error">
        <Badge color="yellow" size="lg" radius="xs">
          {hasanat} Hasanat
        </Badge>
        <Badge color="yellow" size="lg" radius="xs">
          {versesReadToday} / {dailyVerseLimit}
        </Badge>
        <Badge color="yellow" size="lg" radius="xs">
          {currentVerse}
        </Badge>
      </Group>
      <div class="Card" dir="rtl">
        <Card>
          <p class="text">{verseText}</p>
        </Card>
      </div>
      <div class="Card" dir="auto">
        <Card >
          <p class="translationText">{translationText}</p>
        </Card>
      </div>

    </div>
    <div class="buttonWrapper">
        <Button style="width: 100%; margin: 0 auto;" on:click={nextVerse}>Next Verse</Button>
    </div>
  {/if}
  {#if versesReadToday >= dailyVerseLimit}
    <div class="" style="text-align: center; margin-top: 20px;">
      <Card>
        You have read enough for today
      </Card>
      <div class="buttonWrapper">
        <Button style="width: 100%; margin: 0 auto;" href="/app ">Go back</Button>
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    height: 100vh;
    position: relative;
  }
  .buttonWrapper {
    position: fixed;
    bottom: 68px;
    left: 50px;
    right: 50px;
    text-align: center; /* Center the button horizontally */
  }
  .text {
    font-family: Noor !important;
    font-size: x-large;
    font-weight: normal;
    font-style: normal;
  }
  .translationText {
    font-family: sans-serif;
    font-size: medium;
    font-weight: normal;
    font-style: normal;
  }
  .Card {
    padding: 10px;
  }
  .group {
    margin-top: 20px;
  }
</style>
