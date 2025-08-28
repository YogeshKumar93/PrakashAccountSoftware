// Function to check if geolocation is supported by the browser
function checkLocationPermission() {
  return "geolocation" in navigator;
}

// Function to attempt IP-based geolocation as a last resort
function getLocationByIP(onSuccess, onFailed) {
  fetch("https://ipinfo.io/json?token=02887545e3da1b") // Use your token here
    .then((response) => response.json())
    .then((data) => {
      const [latitude, longitude] = data.loc.split(",");
      console.log("IP-based location fetched:", latitude, longitude);
      onSuccess(parseFloat(latitude), parseFloat(longitude));
    })
    .catch((error) => {
      console.log("IP-based geolocation failed:", error);
      onFailed("IP-based location retrieval failed.");
    });
}

// Function to get latitude and longitude with GPS, Wi-Fi, and IP-based fallback
function getLatLong(onSuccess, onFailed) {
  let locationFetched = false;

  if (checkLocationPermission()) {
    // First attempt with high accuracy (likely using GPS)
    navigator.geolocation.getCurrentPosition(
      function (position) {
   
        if (position.coords.accuracy < 200) {
          // Use only if accuracy is acceptable
          onSuccess(position.coords.latitude, position.coords.longitude);
          locationFetched = true;
        } else {
          console.log("Low GPS accuracy; attempting Wi-Fi.");
          // If GPS accuracy is too low, attempt Wi-Fi (lower accuracy mode)
          getLatLongWiFi(onSuccess, onFailed, locationFetched);
        }
      },
      function (error) {
        console.log("GPS Error:", error.code);
        if (error.code === error.PERMISSION_DENIED) {
          onFailed("Permission denied by the user.");
        } else {
          console.log("GPS failed; attempting Wi-Fi.");
          // Attempt Wi-Fi if GPS fails for other reasons
          getLatLongWiFi(onSuccess, onFailed, locationFetched);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  } else {
    onFailed("Geolocation is not supported by this browser.");
  }
}

// Function to get location with lower accuracy mode (likely using Wi-Fi)
function getLatLongWiFi(onSuccess, onFailed, locationFetched) {
  if (locationFetched) return; // If location is already fetched, don't try Wi-Fi or IP

  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(
        "Wi-Fi Location fetched:",
        position.coords.latitude,
        position.coords.longitude
      );
      onSuccess(position.coords.latitude, position.coords.longitude);
      locationFetched = true;
    },
    function (error) {
      console.log("Wi-Fi Error:", error.code);
      // If Wi-Fi fails, fall back to IP-based geolocation
      getLocationByIP(onSuccess, onFailed);
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000, // Allow cached location up to 1 minute old
    }
  );
}

// Exported function to get the user's geolocation with caching and fallback
export const getGeoLocation = (onSuccess, onFailed) => {
  let lat, long;
  let locationFetchedAt = null;

  return () => {
    const now = Date.now();
    if (
      !lat ||
      !long ||
      !locationFetchedAt ||
      now - locationFetchedAt > 5 * 60 * 1000
    ) {
      console.log("Fetching fresh location...");
      getLatLong(
        (latX, longX) => {
          lat = latX;
          long = longX;
          locationFetchedAt = now;
          onSuccess(lat, long);
        },
        (err) => {
          onFailed(err);
          console.log("Location error:", err);
        }
      );
    } else {
      console.log("Using cached location:", lat, long);
      onSuccess(lat, long);
    }
  };
};
