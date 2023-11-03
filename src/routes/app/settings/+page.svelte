<script>
  import { NativeSelect } from '@svelteuidev/core';
  import translations from '$lib/translations.json';

  // Initialize selectedTranslation from local storage or as null
  let selectedTranslation = localStorage.getItem('selectedTranslation') || null;

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
</script>

<div>
  <h2>Translation Settings</h2>
  <p>Select your preferred Quran translation:</p>

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
