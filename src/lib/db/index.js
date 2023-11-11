export function addToIndexedDB(dbName, objectData, objectStoreName) {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject("Your browser doesn't support IndexedDB.");
      return;
    }

    const request = window.indexedDB.open(dbName);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(objectStoreName)) {
        const objectStore = db.createObjectStore(objectStoreName, {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex("name", "name", { unique: false });
      }
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction([objectStoreName], "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);

      // Add the object data to the object store
      const addObjectRequest = objectStore.add(objectData);

      addObjectRequest.onsuccess = function (event) {
        db.close();
        resolve("Data added successfully with key: " + event.target.result);
      };

      addObjectRequest.onerror = function (event) {
        db.close();
        reject("Error adding data: " + event.target.error);
      };
    };

    request.onerror = function (event) {
      reject("Error opening the database: " + event.target.error);
    };
  });
}

export function readFromIndexedDB(dbName, objectStoreName) {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject("Your browser doesn't support IndexedDB.");
      return;
    }

    const request = window.indexedDB.open(dbName);

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction([objectStoreName], "readonly");
      const objectStore = transaction.objectStore(objectStoreName);

      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = function (event) {
        db.close();
        resolve(event.target.result);
      };

      getAllRequest.onerror = function (event) {
        db.close();
        reject("Error reading data: " + event.target.error);
      };
    };

    request.onerror = function (event) {
      reject("Error opening the database: " + event.target.error);
    };
  });
}

export function isDailyVerseLimitReached() {
  const today = new Date();
  const day = today.toISOString().split("T")[0]; // Extract the date in "YYYY-MM-DD" format

  // Check if the date exists in local storage
  if (localStorage.getItem(day) !== null) {
    const dailyVerseRead = localStorage.getItem(day);
    const dailyVerseLimit = localStorage.getItem("dailyVerseLimit") || 10;
    console.log(dailyVerseLimit);

    if (parseInt(dailyVerseRead) === dailyVerseLimit) {
      return true; // Daily verse limit reached
    }
  }

  return false; // Daily verse limit not reached
}

// Function to update the daily verse count
export function updateDailyVerseCount() {
  const today = new Date();
  const day = today.toISOString().split("T")[0]; // Extract the date in "YYYY-MM-DD" format

  if (localStorage.getItem(day) !== null) {
    // Date exists in local storage, increment the dailyVerseRead count
    let dailyVerseRead = parseInt(localStorage.getItem(day));
    dailyVerseRead++;
    localStorage.setItem(day, dailyVerseRead);
  } else {
    // Date doesn't exist in local storage, set dailyVerseRead to 1 for the current date
    localStorage.setItem(day, 1);
  }
}
