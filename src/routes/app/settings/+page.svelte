<script>
  import { NativeSelect, NumberInput } from '@svelteuidev/core';
  import translations from '$lib/translations.json';

  $: if (localStorage.getItem("dailyVerseLimit") == "undefined") {
    localStorage.setItem("dailyVerseLimit", 10)
  }


  // Initialize selectedTranslation from local storage or as null
  let selectedTranslation = localStorage.getItem('selectedTranslation') || null;

  // Initialize dailyVerseLimit from local storage or as 5
  let dailyVerseLimit = localStorage.getItem('dailyVerseLimit') || 5;

  // Create an array of translation options
  let translationOptions = translations.map(translation => ({
    value: translation.id,
    label: translation.language,
  }));

  // Function to handle changes when the user selects a translation
  function handleTranslationSelection(event) {
    selectedTranslation = event.target.value;
    // Save the selected translation to local storage
    localStorage.setItem('selectedTranslation', selectedTranslation);
  }

  // Function to handle changes in dailyVerseLimit
  function handleDailyVerseLimitChange() {
    // Save the dailyVerseLimit to local storage
    localStorage.setItem('dailyVerseLimit', dailyVerseLimit);
  }
</script>

<div>
  <h2>Settings</h2>
  <NumberInput
    bind:value={dailyVerseLimit}
    label="Daily Verse Limit"
    min="5"
    placeholder="Enter your daily verse limit"
    on:change={handleDailyVerseLimitChange}
  />

  <NativeSelect
    {selectedTranslation}
    on:change={handleTranslationSelection}
    data={translationOptions}
    placeholder="Select a translation"
    label="Select Translation"
    description="Choose your preferred Quran translation"
  />


  {#if selectedTranslation}
    <p>Your selected translation: {localStorage.getItem("selectedTranslation")}</p>
  {/if}
</div>
