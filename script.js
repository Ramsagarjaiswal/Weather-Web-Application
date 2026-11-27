// Add your WeatherAPI key here. For production, keep API keys on a backend.
const API_KEY = "8c838261de974351813105144262711";
const API_URL = "https://api.weatherapi.com/v1/current.json";

const $ = (id) => document.getElementById(id);
const searchForm = $("searchForm");
const cityInput = $("cityInput");
const locationBtn = $("locationBtn");
const statusEl = $("status");
const weatherContent = $("weatherContent");
const detailsSection = $("detailsSection");
const unitToggle = $("unitToggle");

let currentWeather = null;
let useCelsius = true;

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

async function loadWeather(query) {
  if (!query) return;
  setStatus("Loading weather…");
  weatherContent.hidden = true;
  detailsSection.hidden = true;

  try {
    const params = new URLSearchParams({
      key: API_KEY,
      q: query,
      aqi: "yes"
    });
    const response = await fetch(`${API_URL}?${params.toString()}`);
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || "Could not find weather for this location.");
    }

    currentWeather = data;
    renderWeather(data);
    setStatus(`Weather loaded for ${data.location.name}.`);
    weatherContent.hidden = false;
    detailsSection.hidden = false;
  } catch (error) {
    setStatus(error.message || "Something went wrong. Please try again.", true);
  }
}

function renderWeather(data) {
  const { location, current } = data;
  $("placeName").textContent = `${location.name}, ${location.country}`;
  $("localTime").textContent = new Date(location.localtime.replace(" ", "T")).toLocaleString(undefined, {
    weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit"
  });
  $("conditionPill").textContent = current.is_day ? "☀ Daytime" : "☾ Nighttime";
  $("temperature").textContent = `${Math.round(useCelsius ? current.temp_c : current.temp_f)}°`;
  $("conditionText").textContent = current.condition.text;
  $("weatherIcon").src = `https:${current.condition.icon}`;
  $("weatherIcon").alt = current.condition.text;
  $("feelsLike").textContent = `${Math.round(useCelsius ? current.feelslike_c : current.feelslike_f)}°`;
  $("rainChance").textContent = `${current.precip_mm} mm`;
  $("uvIndex").textContent = current.uv;
  $("humidity").textContent = `${current.humidity}%`;
  $("wind").textContent = `${useCelsius ? current.wind_kph : current.wind_mph} ${useCelsius ? "km/h" : "mph"}`;
  $("windDirection").textContent = `${current.wind_dir} direction`;
  $("pressure").textContent = `${current.pressure_mb} mb`;
  $("visibility").textContent = `${useCelsius ? current.vis_km : current.vis_miles} ${useCelsius ? "km" : "mi"}`;
  $("updatedAt").textContent = `Updated ${current.last_updated}`;

  renderAirQuality(current.air_quality);
  unitToggle.innerHTML = useCelsius ? "<strong>°C</strong> <span>/</span> °F" : "°C <span>/</span> <strong>°F</strong>";
}

function renderAirQuality(air) {
  if (!air || air["us-epa-index"] == null) {
    $("aqiValue").textContent = "N/A";
    $("aqiLabel").textContent = "AQI";
    $("aqiDescription").textContent = "Air quality data is not available for this location.";
    $("aqiBar").style.marginLeft = "0%";
    return;
  }

  const index = Number(air["us-epa-index"]);
  const labels = {
    1: ["Good", "Air quality is considered satisfactory."],
    2: ["Moderate", "Acceptable air quality; unusually sensitive people may notice effects."],
    3: ["Unhealthy for sensitive groups", "Sensitive groups may experience health effects."],
    4: ["Unhealthy", "Some members of the public may experience health effects."],
    5: ["Very unhealthy", "Health alert: increased health effects for everyone."],
    6: ["Hazardous", "Health warning: everyone may experience more serious effects."]
  };
  const [label, description] = labels[index] || ["Unavailable", "Air quality index could not be interpreted."];
  $("aqiValue").textContent = index;
  $("aqiLabel").textContent = label;
  $("aqiDescription").textContent = description;
  $("aqiBar").style.marginLeft = `${Math.max(0, Math.min(96, (index - 1) * 19))}%`;
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    setStatus("Please enter a city or location.", true);
    cityInput.focus();
    return;
  }
  loadWeather(city);
});

locationBtn.addEventListener("click", () => {
  if (!("geolocation" in navigator)) {
    setStatus("Geolocation is not supported by this browser. Search for a city instead.", true);
    return;
  }

  setStatus("Requesting your location permission…");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      loadWeather(`${latitude},${longitude}`);
    },
    (error) => {
      const messages = {
        1: "Location permission was denied. Allow location access or search for a city.",
        2: "Your location could not be determined. Try searching for a city.",
        3: "Location request timed out. Please try again."
      };
      setStatus(messages[error.code] || "Unable to get your location. Search for a city instead.", true);
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 }
  );
});

unitToggle.addEventListener("click", () => {
  useCelsius = !useCelsius;
  if (currentWeather) renderWeather(currentWeather);
});

// Ask for location on first visit. If permission is denied, show a useful fallback.
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => loadWeather(`${position.coords.latitude},${position.coords.longitude}`),
    () => {
      setStatus("Allow location access to see your local weather, or search for a city above.");
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  );
} else {
  setStatus("Search for a city to see its current weather.");
}
