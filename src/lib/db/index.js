export async function addToIndexedDB(dbName, objectData, objectStoreName) {
  return new Promise(async (resolve, reject) => {
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

    request.onsuccess = async function (event) {
      const db = event.target.result;

      // Check if the object store exists, create it if not
      if (!db.objectStoreNames.contains(objectStoreName)) {
        const version = db.version + 1;
        db.close();
        const upgradedDB = await new Promise(
          (resolveUpgrade, rejectUpgrade) => {
            const upgradeRequest = window.indexedDB.open(dbName, version);

            upgradeRequest.onupgradeneeded = function (event) {
              const upgradedDB = event.target.result;
              upgradedDB.createObjectStore(objectStoreName, {
                keyPath: "id",
                autoIncrement: true,
              });
              resolveUpgrade(upgradedDB);
            };

            upgradeRequest.onsuccess = function (event) {
              const upgradedDB = event.target.result;
              upgradedDB.close();
              resolveUpgrade(upgradedDB);
            };

            upgradeRequest.onerror = function (event) {
              rejectUpgrade(
                "Error upgrading the database: " + event.target.error
              );
            };
          }
        );

        const transaction = upgradedDB.transaction(
          [objectStoreName],
          "readwrite"
        );
        const objectStore = transaction.objectStore(objectStoreName);

        const addObjectRequest = objectStore.add(objectData);

        addObjectRequest.onsuccess = function (event) {
          upgradedDB.close();
          resolve("Data added successfully with key: " + event.target.result);
        };

        addObjectRequest.onerror = function (event) {
          upgradedDB.close();
          reject("Error adding data: " + event.target.error);
        };
      } else {
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
      }
    };

    request.onerror = function (event) {
      reject("Error opening the database: " + event.target.error);
    };
  });
}

export async function readFromIndexedDB(dbName, objectStoreName) {
  return new Promise(async (resolve, reject) => {
    if (!window.indexedDB) {
      reject("Your browser doesn't support IndexedDB.");
      return;
    }

    const request = window.indexedDB.open(dbName);

    request.onsuccess = async function (event) {
      const db = event.target.result;

      // Check if the object store exists, create it if not
      if (!db.objectStoreNames.contains(objectStoreName)) {
        const version = db.version + 1;
        db.close();
        const upgradedDB = await new Promise(
          (resolveUpgrade, rejectUpgrade) => {
            const upgradeRequest = window.indexedDB.open(dbName, version);

            upgradeRequest.onupgradeneeded = function (event) {
              const upgradedDB = event.target.result;
              upgradedDB.createObjectStore(objectStoreName, {
                keyPath: "id",
                autoIncrement: true,
              });
              resolveUpgrade(upgradedDB);
            };

            upgradeRequest.onsuccess = function (event) {
              const upgradedDB = event.target.result;
              upgradedDB.close();
              resolveUpgrade(upgradedDB);
            };

            upgradeRequest.onerror = function (event) {
              rejectUpgrade(
                "Error upgrading the database: " + event.target.error
              );
            };
          }
        );

        const transaction = upgradedDB.transaction(
          [objectStoreName],
          "readonly"
        );
        const objectStore = transaction.objectStore(objectStoreName);

        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = function (event) {
          upgradedDB.close();
          resolve(event.target.result);
        };

        getAllRequest.onerror = function (event) {
          upgradedDB.close();
          reject("Error reading data: " + event.target.error);
        };
      } else {
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
      }
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
