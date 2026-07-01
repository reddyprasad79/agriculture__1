
(function () {
  const nav = document.getElementById("siteNav");
  const menu = document.getElementById("menuBtn");

  if (menu && nav) {
    menu.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  function revealSections() {
    document.querySelectorAll(".reveal").forEach(function (item) {
      const top = item.getBoundingClientRect().top;
      if (top < window.innerHeight - 80) {
        item.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", revealSections);
  window.addEventListener("load", revealSections);
  revealSections();

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      window.location.href = "404.html";
    });
  }

  const signinForm = document.getElementById("signinForm");
  if (signinForm) {
    signinForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("signinEmail").value.trim();
      const password = document.getElementById("signinPassword").value.trim();
      const role = document.getElementById("signinRole").value;
      if (!email || password.length < 6 || !role) {
        alert("Please enter valid email, password, and role.");
        return;
      }
      localStorage.setItem("stackly_agri_session", JSON.stringify({ email: email, role: role }));
      alert("Login successful.");
      if (role === "farmer") {
        window.location.href = "farmer-dashboard.html";
      } else {
        window.location.href = "agri-business-dashboard.html";
      }
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const password = document.getElementById("regPassword").value;
      const confirm = document.getElementById("regConfirm").value;
      if (password.length < 6) {
        alert("Password must be minimum 6 characters.");
        return;
      }
      if (password !== confirm) {
        alert("Password and Confirm Password must match.");
        return;
      }
      alert("Account created successfully. Please sign in now.");
      window.location.href = "signin.html";
    });
  }
})();


/* Dashboard functionality */
(function () {
  const dashboardPage = document.querySelector(".dashboard-page");
  if (!dashboardPage) return;

  const session = JSON.parse(localStorage.getItem("stackly_agri_session") || "null");
  const allowedRole = document.body.dataset.role;

  if (!session || !session.role) {
    window.location.href = "signin.html";
    return;
  }

  if (allowedRole && session.role !== allowedRole) {
    window.location.href = session.role === "farmer" ? "farmer-dashboard.html" : "agri-business-dashboard.html";
    return;
  }

  const userEmail = document.getElementById("dashboardEmail");
  if (userEmail) userEmail.textContent = session.email || "user@stackly.com";

  const pageTitle = document.getElementById("dashTitle");
  const pageSub = document.getElementById("dashSub");
  const panels = document.querySelectorAll(".dash-panel");

  function openPanel(panelName, label) {
    panels.forEach(function (panel) {
      panel.classList.toggle("active", panel.dataset.panel === panelName);
    });

    document.querySelectorAll(".dash-link").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.target === panelName);
    });

    if (pageTitle) pageTitle.textContent = label;
    if (pageSub) pageSub.textContent = "Manage " + label.toLowerCase() + " details from your STACKLY dashboard.";
  }

  document.querySelectorAll(".dash-link").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openPanel(btn.dataset.target, btn.dataset.label);
    });
  });

  const logout = document.getElementById("logoutBtn");
  if (logout) {
    logout.addEventListener("click", function () {
      localStorage.removeItem("stackly_agri_session");
      window.location.href = "index.html";
    });
  }

  document.querySelectorAll("[data-fake-action]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const action = btn.dataset.fakeAction;
      const status = document.getElementById("actionStatus");
      if (status) {
        status.textContent = action + " completed successfully.";
        status.classList.add("show");
        setTimeout(function () { status.classList.remove("show"); }, 2600);
      }
    });
  });

  openPanel("overview", "Overview");
})();
