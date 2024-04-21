// Global Variable
var timer = null;
var startTime = null;
var elapsedTime = 0;

// Function to start the Timer
function startTimer() {
  if (timer) return;
  const taskNameInput = document.getElementById("activityName");
  document.getElementById("popupTaskName").querySelector("span").textContent =
    taskNameInput.value || "Unnamed Task";
  document.getElementById("taskPopup").style.display = "block";
  document.getElementById("overlay").style.display = "block";
  document.body.classList.add("no-scroll");
  startTime = new Date();
  timer = setInterval(updateTimerDisplay, 1000);
}

//Function to stop the Timer
function stopTimer() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
  const endTime = new Date();
  const taskName =
    document.getElementById("activityName").value || "Unnamed Task";
  logEvent(taskName, startTime, endTime);
  updateLogsDisplay();
  closePopup();
}

// Function to close the popup
function closePopup() {
  document.getElementById("taskPopup").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  document.body.classList.remove("no-scroll");
  document.getElementById("activityName").value = "";
}

// Function to update the Timer Display
function updateTimerDisplay() {
  const now = new Date();
  elapsedTime = now - startTime;
  const totalSeconds = Math.floor(elapsedTime / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  document.getElementById("timerDisplay").textContent = `${hours}:${minutes}:${seconds}`;
}
 // Function to log events manually
function logManualEvent() {
  const activityName = document.getElementById("manualActivityName").value;
  const startTime = new Date(document.getElementById("manualStartTime").value);
  const endTime = new Date(document.getElementById("manualEndTime").value);

  if (startTime >= endTime) {
      alert("Start time must be before end time.");
      return;
  }

  logEvent(activityName || "Unnamed Task", startTime, endTime);
  updateLogsDisplay();
}

// Function to log the activity
function logEvent(activityName, start, end) {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  const duration = end - start;
  const durationFormatted = new Date(duration).toISOString().substr(11, 8);
  logs.push({
      activityName,
      startTime: start.toLocaleTimeString(),
      endTime: end.toLocaleTimeString(),
      duration: durationFormatted,
  });
  localStorage.setItem("logs", JSON.stringify(logs));
}

// Function to update the display of logged tasks
function updateLogsDisplay() {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  const logList = document.querySelector(".content");
  logList.innerHTML = "<h2>Task list</h2>";

  logs.forEach((log, index) => {
    const div = document.createElement("div");
    div.className = "taskItem";
    div.innerHTML = `
            <h3 class="taskName">${log.activityName}</h3>
            <p class="taskStartEnd">${log.startTime} - ${log.endTime}</p>
            <p class="duration">${log.duration}</p>
            <div class="actions">
                <span class="material-symbols-outlined delete" onclick="deleteLog(${index})">delete</span>
            </div>
        `;
    logList.appendChild(div);
  });
}

// Function to delete a log
function deleteLog(index) {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  logs.splice(index, 1);
  localStorage.setItem("logs", JSON.stringify(logs));
  updateLogsDisplay();
}

// Function to update greeting based on the time of day
function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();
  let greeting;

  if (hour >= 5 && hour < 12) {
    greeting = "Good morning!";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon!";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good evening!";
  } else {
    greeting = "Good night!";
  }

  document.getElementById("userGreeting").innerText = greeting;
}

// Setup analytics and initial display update
function setupAnalytics() {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const data = new Array(7).fill(0);

  logs.forEach(log => {
      const day = new Date(log.startTime).getDay();
      const duration = new Date(log.duration).getTime();
      data[day] += duration / (1000 * 60 * 60); // Convert milliseconds to hours
  });

  new Chart(document.getElementById("timeChart"), {
      type: 'bar',
      data: {
          labels: weekDays,
          datasets: [{
              label: 'Hours logged per day',
              data: data,
              backgroundColor: 'rgba(74, 112, 255, 0.7)'
          }]
      }
  });
}
  document.addEventListener("DOMContentLoaded", function () {
  updateGreeting();
  updateLogsDisplay();
  setupAnalytics();
});
