export function renderHome(app) {
  app.innerHTML = `
    <section class="hero">
      <h1>Train smarter with weather-powered AI 🌤️</h1>
      <p>Sportsbreeze creates personalized training routines based on your local weather forecast.</p>
      <button onclick="window.location.hash = '#/register'">Sign Up Free</button>
      <button onclick="window.location.hash = '#/register'">Learn More</button>
    </section>

    <section>
      <h2>Choose your favorite sports</h2>
      <div class="grid grid-3">
        <div class="card">🏃 Running</div>
        <div class="card">🚴 Cycling</div>
        <div class="card">🎾 Tennis</div>
        <div class="card">⚽ Soccer</div>
        <div class="card">🧘 Yoga</div>
        <div class="card">🏊 Swimming</div>
      </div>
    </section>

    <section>
      <h2>Why Sportsbreeze?</h2>
      <div class="grid grid-3">
        <div class="card"><h3>🌤️ Check Weather</h3><p>Never miss a perfect day to train.</p></div>
        <div class="card"><h3>📅 Plan Ahead</h3><p>Get AI-powered recommendations.</p></div>
        <div class="card"><h3>✅ Safe & Fun</h3><p>Train safely with climate insights.</p></div>
      </div>
    </section>
  `;
}
