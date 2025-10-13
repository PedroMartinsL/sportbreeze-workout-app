import { renderHome } from "./home.js";
import { renderRegister } from "./register.js";
import { renderRoutine } from "./routine.js";

const app = document.getElementById("app");

function router() {
  const route = window.location.hash.slice(1) || "/";
  app.innerHTML = "";

  switch (route) {
    case "/":
      renderHome(app);
      break;
    case "/register":
      renderRegister(app);
      break;
    case "/routine":
      renderRoutine(app);
      break;
    default:
      app.innerHTML = `<h2>404 - Page Not Found</h2>`;
  }
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
