export function renderRoutine(app) {
  const data = JSON.parse(localStorage.getItem("routineData") || "{}");
  const { name = "Athlete", sports = "Running", days = "Mon, Wed, Fri", hours = 5 } = data;

  app.innerHTML = `
    <h1>Welcome back, ${name} 👋</h1>
    <section class="card">
      <h3>🏋️ Training Profile</h3>
      <p><b>Sports:</b> ${sports}</p>
      <p><b>Days:</b> ${days}</p>
      <p><b>Hours/week:</b> ${hours}</p>
    </section>

    <section class="card">
      <h3>📍 Location</h3>
      <p id="gps">Detecting location...</p>
    </section>

    <button class="primary" id="generateWorkout">Generate Workout</button>
  `;

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        document.getElementById("gps").textContent =
          `Lat: ${pos.coords.latitude.toFixed(4)}, Lon: ${pos.coords.longitude.toFixed(4)}`;
      },
      () => {
        document.getElementById("gps").textContent = "Unable to detect location.";
      }
    );
  }

  document.getElementById("generateWorkout").addEventListener("click", () => {
    alert(`Workout created for ${name}!\nSports: ${sports}\nDays: ${days}\nHours: ${hours}`);
  });
}
