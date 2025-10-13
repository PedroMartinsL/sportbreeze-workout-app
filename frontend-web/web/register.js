export function renderRegister(app) {
  app.innerHTML = `
    <h1>Create Your Profile</h1>
    <p>Tell us about yourself to personalize your training plan.</p>

    <form id="registerForm">
      <label>Full Name <input class="input" name="name" required /></label><br><br>
      <label>Age <input class="input" type="number" name="age" /></label><br><br>
      <label>Weight (kg) <input class="input" type="number" name="weight" /></label><br><br>
      <label>Height (cm) <input class="input" type="number" name="height" /></label><br><br>

      <h3>Sports</h3>
      <label><input type="checkbox" name="sports" value="running" checked /> Running</label>
      <label><input type="checkbox" name="sports" value="cycling" /> Cycling</label>
      <label><input type="checkbox" name="sports" value="gym" /> Gym</label>
      <label><input type="checkbox" name="sports" value="swimming" /> Swimming</label><br><br>

      <h3>Days</h3>
      <label><input type="checkbox" name="days" value="Mon" /> Mon</label>
      <label><input type="checkbox" name="days" value="Wed" /> Wed</label>
      <label><input type="checkbox" name="days" value="Fri" /> Fri</label>
      <label><input type="checkbox" name="days" value="Sun" /> Sun</label><br><br>

      <label>Hours per week <input class="input" type="number" name="hours" value="5" /></label><br><br>

      <button class="primary" type="submit">Save and Continue</button>
    </form>
  `;

  document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
      name: form.get("name"),
      sports: form.getAll("sports").join(", "),
      days: form.getAll("days").join(", "),
      hours: form.get("hours"),
    };
    localStorage.setItem("routineData", JSON.stringify(data));
    window.location.hash = "#/routine";
  });
}
