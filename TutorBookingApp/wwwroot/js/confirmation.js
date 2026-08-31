// Booking confirmation display
// Author: Tyler (Yusen Xu)

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get("id");

    const allBookings = JSON.parse(localStorage.getItem("tutorBookings")) || [];
    let currentBooking = null;

    if (bookingId) {
        currentBooking = allBookings.find(b => b.id.toString() === bookingId.toString());
    }

    if (!currentBooking && allBookings.length > 0) {
        currentBooking = allBookings[allBookings.length - 1];
    }

    if (currentBooking) {
        document.getElementById("conf-student-name").textContent = currentBooking.studentName || "";
        document.getElementById("conf-student-id").textContent = currentBooking.studentId || "";
        document.getElementById("conf-email").textContent = currentBooking.email || "";
        document.getElementById("conf-tutor-name").textContent = currentBooking.tutor || "";
        document.getElementById("conf-subject-name").textContent = currentBooking.subject || "";
        document.getElementById("conf-date").textContent = currentBooking.date || "";
        document.getElementById("conf-time").textContent = currentBooking.time || "";
        document.getElementById("conf-session-type").textContent = currentBooking.sessionType || "";
        document.getElementById("conf-reason").textContent = currentBooking.reason || "";
    }
});
