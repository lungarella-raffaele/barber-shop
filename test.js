// Set the duration for the timer (10 minutes in milliseconds)
const duration = 10 * 60 * 1000;
let timeLeft = duration;
let timerInterval;

// Format time as MM:SS
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Update the timer display
function updateTimer() {
  timeLeft -= 1000;
  
  // Display the formatted time
  console.log(formatTime(timeLeft));
  
  // Check if the timer has finished
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    console.log("Time's up!");
    
    // You could add code here to play a sound or show a notification
  }
}

// Start the timer
function startTimer() {
  console.log("Timer started: 10:00");
  timerInterval = setInterval(updateTimer, 1000);
}

// Function to pause the timer
function pauseTimer() {
  clearInterval(timerInterval);
  console.log("Timer paused at:", formatTime(timeLeft));
}

// Function to resume the timer
function resumeTimer() {
  timerInterval = setInterval(updateTimer, 1000);
  console.log("Timer resumed from:", formatTime(timeLeft));
}

// Function to reset the timer
function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = duration;
  console.log("Timer reset to: 10:00");
}

// Call startTimer() to begin the countdown
startTimer();
