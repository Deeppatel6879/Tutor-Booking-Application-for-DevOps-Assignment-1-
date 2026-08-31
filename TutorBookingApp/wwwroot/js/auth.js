// Authentication and Session Management for Tutor Connect
// Author: Tyler (Yusen Xu)

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const authMessage = document.getElementById("auth-message");
    const navAuthLink = document.getElementById("nav-auth-link");
    const mainNav = document.querySelector(".navigation nav") || document.getElementById("main-nav");

    // Load active session from localStorage
    const currentUser = JSON.parse(localStorage.getItem("tutorCurrentUser"));

    // Update navigation bar with user session status
    if (mainNav) {
        if (currentUser) {
            const userContainer = document.createElement("div");
            userContainer.className = "user-badge";
            userContainer.innerHTML = `
                <span>Welcome, <strong>${currentUser.name}</strong></span>
                <button type="button" class="btn-logout" id="btn-logout">Sign Out</button>
            `;

            // Replace or update login link in nav
            const existingLogin = mainNav.querySelector('a[href*="login.html"]');
            if (existingLogin) {
                existingLogin.replaceWith(userContainer);
            } else {
                mainNav.appendChild(userContainer);
            }

            document.getElementById("btn-logout")?.addEventListener("click", function () {
                localStorage.removeItem("tutorCurrentUser");
                window.location.reload();
            });
        }
    }

    // Auto-fill student information in booking.html if logged in
    const studentNameField = document.getElementById("student-name");
    const studentIdField = document.getElementById("student-id");
    const emailField = document.getElementById("email");

    if (currentUser && studentNameField && studentIdField && emailField) {
        if (!studentNameField.value) studentNameField.value = currentUser.name;
        if (!studentIdField.value) studentIdField.value = currentUser.studentId;
        if (!emailField.value) emailField.value = currentUser.email;
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const studentId = document.getElementById("login-student-id").value.trim();
            const studentName = document.getElementById("login-student-name").value.trim();
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;

            // Form validation
            if (!studentId || !studentName || !email || !password) {
                showAuthMessage("All fields are required to sign in.", "error");
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAuthMessage("Please enter a valid student email address.", "error");
                return;
            }

            if (password.length < 4) {
                showAuthMessage("Password must be at least 4 characters.", "error");
                return;
            }

            // Save user session
            const userSession = {
                studentId: studentId,
                name: studentName,
                email: email,
                loggedInAt: new Date().toISOString()
            };

            localStorage.setItem("tutorCurrentUser", JSON.stringify(userSession));
            showAuthMessage(`Sign-in successful! Welcome back, ${studentName}. Redirecting...`, "success");

            // Redirect to booking page after login
            setTimeout(function () {
                window.location.href = "booking.html";
            }, 1000);
        });
    }

    function showAuthMessage(msg, type) {
        if (!authMessage) return;
        authMessage.textContent = msg;
        authMessage.className = `auth-alert ${type}`;
        authMessage.style.display = "block";
    }
});
