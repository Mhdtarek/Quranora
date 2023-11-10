<script>
  import {
    startCustomReading,
    readNextCustomVerse
  } from '$lib'; 
  import { NativeSelect, Button, Text, Badge, Group, Card } from '@svelteuidev/core';
  import surahs from '$lib/surahs.json';

  let userId = 'user123';

  // Step 1: Show Surah Selector Only
  let showSurahSelector = true;
  // Step 2: Surah Selection
  let selectedSurah = null;
  let selectedSurahObject = {};
  // Step 3: Verse (Ayah) Selection
  let selectedAyah = 1;
  let ayahArray = [];
  let value = selectedAyah;
  let currentVerse = "1:1";
  let verseText;
  let translationText;
  let hasanat;
  let message;

  // Step 2: Surah Selection
  function handleSurahChange(event) {
    selectedSurah = event.target.value;
    selectedSurahObject = surahs.find(surah => surah.name === selectedSurah);
    getAyahs(selectedSurahObject.verses);
    selectedAyah = null;
  }

  // Step 3: Verse (Ayah) Selection
  function handleVerseChange(event) {
    selectedAyah = event.target.value;
    getAyahs(selectedSurahObject.verses);
  }

  // Step 4: Start Reading Button
  function handleStartButtonClick() {
    // Use the selectedSurah and selectedAyah values for initialization
    console.log(`Starting from Surah ${selectedSurah}, Verse ${selectedAyah}`);
    
    // Step 4: Update the currentVerse
    currentVerse = `${selectedSurahObject.surah}:${selectedAyah}`;
    
    // Step 4: Hide Surah Selector and Show Reader
    showSurahSelector = false;

    // Step 4: Initialize custom reading progress
    initCustomReading();
  }

  function getAyahs(maxAyah) {
    ayahArray = [];
    for (let i = 1; i <= maxAyah; i++) {
      ayahArray.push(i.toString());
    }
  }

  // Step 5: Reader Section
  // Function to initialize custom reading progress
  async function initCustomReading() {
    const readingProgress = await startCustomReading(userId, currentVerse);
    currentVerse = readingProgress.currentVerse;
    verseText = readingProgress.verseText;
    translationText = readingProgress.translationText;
    hasanat = readingProgress.hasanat;
    message = "Go";
  }

  // Step 5: Reader Section
  // Function to read the next verse in custom mode
  async function nextCustomVerse() {
    const result = await readNextCustomVerse(userId, currentVerse);
    currentVerse = result.currentVerse;
    verseText = result.verseText;
    translationText = result.translationText;
    hasanat = result.hasanat;
    message = result.message;
  }
</script>

<main>
  {#if showSurahSelector}
    <!-- Step 1: Show Surah Selector Only -->
    <h2 style="text-align: center;">Custom Read</h2>
    <div>
      <NativeSelect
        data={surahs.map(surah => surah.name)}
        placeholder="Select Surah"
        label="Surah"
        on:change={handleSurahChange}
      />
    </div>
    
    {#if selectedSurah !== null}
      <div>
        <NativeSelect
          data={ayahArray}
          placeholder="Select Verse"
          label="Verse"
          on:change={handleVerseChange}
        />
      </div>
      {#if selectedAyah}
        <div style="margin-top: 20px;">
          <Button fullSize variant="light" on:click={handleStartButtonClick}>Start Reading</Button>
        </div>
      {/if}
    {/if}
  {/if}

  {#if !showSurahSelector}
    <!-- Step 5: Reader Section -->
    <div class="group">
      <Group position="apart" spacing="md" class="error">
        <Badge color="yellow" size="lg" radius="xs">
          {hasanat} Hasanat
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
        <Card>
          <p class="translationText">{translationText}</p>
        </Card>
      </div>
    </div>
    <div class="buttonWrapper">
      <Button style="width: 100%; margin: 0 auto;" on:click={nextCustomVerse}>Next Verse</Button>
    </div>
  {/if}
</main>

<style>
  main {
    height: 100vh;
    position: relative;
    padding: 20px;
  }
  .buttonWrapper {
    position: fixed;
    bottom: 68px;
    left: 50px;
    right: 50px;
    text-align: center;
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
