const API_BASE_URL = (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:10000/api' : '/api';

// Load and display farmer profile
async function loadFarmerProfile() {
  const authToken = localStorage.getItem('authToken');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  if (!authToken || !userData.id) {
    window.location.href = 'login.html';
    return;
  }

  // Load from localStorage first
  let profileData = JSON.parse(localStorage.getItem('farmerProfile') || '{}');

  // Try to fetch from database (3 second timeout)
  if (!profileData || Object.keys(profileData).length === 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${API_BASE_URL}/farm/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        if (result.profile) {
          profileData = result.profile;
          localStorage.setItem('farmerProfile', JSON.stringify(profileData));
        }
      }
    } catch (err) {
      console.log('Database fetch timeout or error (using localStorage)');
    }
  }

  // Display greeting
  const userName = profileData.fullName || userData.name || 'किसान';
  const greetingMsg = `🌾 नमस्ते ${userName}! आपका स्वागत है Krishi Sathi में`;
  document.getElementById('greetingMessage').textContent = greetingMsg;

  // Display all profile fields
  document.getElementById('displayUserName').textContent = profileData.fullName || userData.name || '-';
  document.getElementById('displayUserAge').textContent = profileData.age || '-';
  document.getElementById('displayUserPhone').textContent = profileData.phone || userData.phone || '-';
  document.getElementById('displayUserId').textContent = profileData.farmerId || userData.id || '-';
  document.getElementById('displayUserAadhar').textContent = profileData.aadhar || '-';
  document.getElementById('displayUserGender').textContent = profileData.gender || '-';
  document.getElementById('displayUserAddress').textContent = profileData.address || '-';
  document.getElementById('displayUserLandSize').textContent = profileData.landSize ? `${profileData.landSize} acres` : '-';
  document.getElementById('displayUserFarmingType').textContent = profileData.farmingType || '-';
  document.getElementById('displayUserCrops').textContent = profileData.crops || '-';
  document.getElementById('displayUserLivestock').textContent = profileData.livestock || '-';
  document.getElementById('displayUserBankLinked').textContent = profileData.bankLinked || '-';
  document.getElementById('displayUserLoanDetails').textContent = profileData.loanDetails || '-';
  document.getElementById('displayUserFertilizers').textContent = profileData.fertilizers || '-';
  document.getElementById('displayUserPesticides').textContent = profileData.pesticides || '-';
  document.getElementById('displayUserOrganicPractices').textContent = profileData.organicPractices || '-';
  document.getElementById('displayUserMachinery').textContent = profileData.machinery || '-';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  const authToken = localStorage.getItem('authToken');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  if (!authToken || !userData.id) {
    window.location.href = 'login.html';
    return;
  }

  await loadFarmerProfile();

  // Refresh button
  const refreshBtn = document.getElementById('refreshProfileBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.disabled = true;
      refreshBtn.textContent = '⟳ Refreshing...';
      await loadFarmerProfile();
      refreshBtn.disabled = false;
      refreshBtn.textContent = '⟳ Refresh';
    });
  }

  // Logout handler
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('farmerProfile');
        window.location.href = 'login.html';
      }
    });
  }
});

// Calendar functionality
(() => {
  const monthYear = document.getElementById("month-year");
  const calendarBody = document.getElementById("calendar-body");
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");
  const taskDateInput = document.getElementById("task-date");
  const taskTextInput = document.getElementById("task-text");
  const addTaskBtn = document.getElementById("add-task");
  const taskList = document.getElementById("task-list");

  if (!addTaskBtn) return;

  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let tasks = JSON.parse(localStorage.getItem("krishiTasks") || "{}");

  function renderCalendar(month, year) {
    calendarBody.innerHTML = "";
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    monthYear.textContent = `${new Date(year, month).toLocaleString("default", {month:"long"})} ${year}`;

    let date = 1;
    for (let i = 0; i < 6; i++) {
      let row = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        let cell = document.createElement("td");
        if (i === 0 && j < firstDay) {
          cell.textContent = "";
        } else if (date > daysInMonth) {
          cell.textContent = "";
        } else {
          cell.textContent = date;
          const cellDate = new Date(year, month, date).toISOString().split("T")[0];
          if (tasks[cellDate]) {
            cell.classList.add("task-day");
            cell.title = tasks[cellDate].join(", ");
          }
          if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add("today");
          }
          date++;
        }
        row.appendChild(cell);
      }
      calendarBody.appendChild(row);
    }
  }

  function renderTaskList() {
    taskList.innerHTML = "";
    let dates = Object.keys(tasks).sort();
    if (dates.length === 0) {
      taskList.innerHTML = "<li>No upcoming tasks</li>";
      return;
    }
    for (const date of dates) {
      for (const task of tasks[date]) {
        const li = document.createElement("li");
        li.textContent = `${date}: ${task}`;
        taskList.appendChild(li);
      }
    }
  }

  addTaskBtn.addEventListener("click", () => {
    const dateVal = taskDateInput.value;
    const taskVal = taskTextInput.value.trim();
    if (!dateVal || !taskVal) {
      alert("Please select a date and enter a task");
      return;
    }
    if (!tasks[dateVal]) tasks[dateVal] = [];
    tasks[dateVal].push(taskVal);
    localStorage.setItem("krishiTasks", JSON.stringify(tasks));
    taskTextInput.value = "";
    taskDateInput.value = "";
    renderCalendar(currentMonth, currentYear);
    renderTaskList();
  });

  prevBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  nextBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });

  renderCalendar(currentMonth, currentYear);
  renderTaskList();
})();

// Weather functionality
async function fetchWeather(lat, lon, placeName) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia/Kolkata`;
  const weatherDiv = document.getElementById('weatherData');
  weatherDiv.innerHTML = '<div class="spinner"></div>';
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const current = data.current;
    const weatherCodes = {
      0: "Clear sky ☀️", 1: "Mainly clear 🌤️", 2: "Partly cloudy ⛅", 3: "Overcast ☁️",
      45: "Fog 🌫️", 48: "Rime fog 🌫️", 51: "Light drizzle 🌦️", 53: "Drizzle 🌦️", 55: "Dense drizzle 🌧️",
      61: "Slight rain 🌦️", 63: "Rain 🌧️", 65: "Heavy rain 🌧️", 80: "Slight showers 🌦️", 81: "Showers 🌦️", 82: "Violent showers 🌧️", 95: "Thunderstorm ⛈️"
    };
    weatherDiv.innerHTML = `
      <strong>Location:</strong> ${placeName}<br>
      <strong>Temperature:</strong> ${current.temperature_2m}°C<br>
      <strong>Condition:</strong> ${weatherCodes[current.weather_code] || "Unknown"}<br>
      <strong>Humidity:</strong> ${current.relative_humidity_2m}%<br>
      <strong>Wind:</strong> ${current.wind_speed_10m} km/h
    `;
  } catch {
    weatherDiv.innerHTML = '<span class="text-danger">Could not fetch weather data.</span>';
  }
}

async function fetchWeatherByLocationName(location) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
  const weatherDiv = document.getElementById('weatherData');
  weatherDiv.innerHTML = '<div class="spinner"></div>';
  try {
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      weatherDiv.innerHTML = '<span class="text-danger">Location not found.</span>';
      return;
    }
    const place = geoData.results[0];
    fetchWeather(place.latitude, place.longitude, `${place.name}${place.admin1 ? ', ' + place.admin1 : ''}${place.country ? ', ' + place.country : ''}`);
  } catch {
    weatherDiv.innerHTML = '<span class="text-danger">Could not fetch location data.</span>';
  }
}

const weatherForm = document.getElementById('weather-location-form');
if (weatherForm) {
  weatherForm.onsubmit = function(e) {
    e.preventDefault();
    const location = document.getElementById('weather-location-input').value.trim();
    if (location) fetchWeatherByLocationName(location);
  };
}

const geoLocateBtn = document.getElementById('weather-geolocate');
if (geoLocateBtn) {
  geoLocateBtn.onclick = function() {
    const weatherDiv = document.getElementById('weatherData');
    weatherDiv.innerHTML = '<div class="spinner"></div>';
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude, lon = pos.coords.longitude;
          const geoUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`;
          try {
            const geoRes = await fetch(geoUrl);
            const geoData = await geoRes.json();
            let placeName = "Your Location";
            if (geoData.results && geoData.results.length > 0) {
              const place = geoData.results[0];
              placeName = `${place.name}${place.admin1 ? ', ' + place.admin1 : ''}${place.country ? ', ' + place.country : ''}`;
            }
            fetchWeather(lat, lon, placeName);
          } catch {
            fetchWeather(lat, lon, "Your Location");
          }
        },
        () => {
          weatherDiv.innerHTML = '<span class="text-danger">Location access denied.</span>';
        }
      );
    } else {
      weatherDiv.innerHTML = '<span class="text-danger">Geolocation not supported.</span>';
    }
  };
  geoLocateBtn.click();
}

// Soil health
document.getElementById('soilPh').textContent = '6.8 (Ideal)';
document.getElementById('organicMatter').textContent = '3.2% (Good)';
document.getElementById('soilRecommendations').textContent = 'Add compost and lime if pH drops.';

// Pest alerts
const pestList = document.getElementById('pestList');
const alerts = [
  'Locust swarm reported nearby - increased vigilance required.',
  'Aphid infestation detected in the last week.'
];
pestList.innerHTML = '';
alerts.forEach(alert => {
  const li = document.createElement('li');
  li.textContent = alert;
  pestList.appendChild(li);
});
