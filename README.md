# Atmos – Weather Website 🌤️

Atmos is a responsive weather website that displays the **current weather conditions** of a searched city or the user's current location. It uses the [WeatherAPI](https://www.weatherapi.com/) service to fetch live weather and air-quality information.

## ✨ Features

- **Live current weather:** View the current temperature and weather condition.
- **Location search:** Search for weather by city, town, or postcode.
- **Current location:** Use the browser's Geolocation feature to get local weather.
- **Temperature conversion:** Switch between Celsius (°C) and Fahrenheit (°F).
- **Feels-like temperature:** Check how the temperature feels.
- **Air quality information:** View the US EPA air-quality index when available.
- **Weather details:** View humidity, wind speed and direction, pressure, visibility, UV index, and precipitation.
- **Responsive design:** Layout adapts to desktop, tablet, and mobile screens.
- **Error handling:** Displays helpful messages for invalid locations, denied location access, and API errors.

## 🛠️ Technologies Used

- HTML5 – page structure
- CSS3 – styling and responsive layout
- JavaScript – application logic and API requests
- WeatherAPI – current weather and air-quality data
- Browser Geolocation API – current-location detection

## 📁 Project Structure

```text
weather_app/
├── index.html    # Website structure
├── style.css     # Styling and responsive design
├── script.js     # WeatherAPI requests and app functionality
└── README.md     # Project documentation
```

## 🚀 Getting Started

### 1. Download or clone the project

Download the project files or clone your repository:

```bash
git clone <your-repository-url>
```

### 2. Open the project

Open the project folder in Visual Studio Code.

### 3. Add your WeatherAPI key

1. Create an account at [WeatherAPI.com](https://www.weatherapi.com/) and get an API key.
2. Open `script.js`.
3. Find the `API_KEY` constant near the top of the file and replace its value with your own key:

```javascript
const API_KEY = "YOUR_WEATHERAPI_KEY";
```

The app requests current weather using this endpoint:

```text
https://api.weatherapi.com/v1/current.json
```

It requests air-quality information using the `aqi=yes` parameter.

### 4. Run the website

The easiest way to run the project locally is with the **Live Server** extension in VS Code:

1. Install the Live Server extension.
2. Right-click `index.html`.
3. Select **Open with Live Server**.

You can also host the files on a web server that serves the site over HTTPS.

> **Note:** Browser geolocation generally requires HTTPS or a trusted local development address such as `localhost`. If location access is unavailable, you can still search for a city manually.

## 🔑 API Key Security

The API key in a frontend JavaScript file is visible to anyone who inspects the website. For learning and local practice, you can use this setup, but **do not publish a real API key in a public repository**. For a public deployment, move API requests to a backend and keep the key in a server-side environment variable. If a key has already been exposed publicly, regenerate it from your WeatherAPI account.

## 📱 Responsive Design

The interface uses CSS Grid, Flexbox, and media queries to adapt its layout to different screen sizes, including mobile phones, tablets, and desktops.

## 📌 Important

This is the **current-weather version** of Atmos. It displays current conditions and weather details; it does not include a multi-day forecast.

## 👨‍💻 Author

Created as a frontend project using HTML, CSS, JavaScript, and WeatherAPI.
