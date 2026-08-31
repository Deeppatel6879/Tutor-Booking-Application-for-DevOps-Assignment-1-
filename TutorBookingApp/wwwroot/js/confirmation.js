// Booking Confirmation Ticket Logic & Calendar Integration
// Author: Tyler (Yusen Xu)

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get("id");

    // Load bookings from LocalStorage
    const allBookings = JSON.parse(localStorage.getItem("tutorBookings")) || [];
    let currentBooking = null;

    if (bookingId) {
        currentBooking = allBookings.find(b => b.id.toString() === bookingId.toString());
    }

    if (!currentBooking && allBookings.length > 0) {
        currentBooking = allBookings[allBookings.length - 1]; // Pick most recent booking
    }

    // Default fallback demo data if no booking exists yet
    if (!currentBooking) {
        currentBooking = {
            id: Date.now(),
            studentName: "Yusen Xu",
            studentId: "22503513",
            email: "yusen.xu@student.weltec.ac.nz",
            tutor: "Sarah Johns",
            subject: "Programming",
            date: new Date().toISOString().split("T")[0],
            time: "10:00 AM - 11:00 AM",
            sessionType: "In-Person",
            reason: "DevOps & Cloud Architecture Discussion"
        };
    }

    // Populate ticket fields
    const refId = `#TB-${currentBooking.id.toString().slice(-6)}`;
    document.getElementById("ticket-ref-id").textContent = refId;
    document.getElementById("conf-tutor-name").textContent = currentBooking.tutor || "Assigned Tutor";
    document.getElementById("conf-subject-name").textContent = `Subject: ${currentBooking.subject || "General"}`;
    document.getElementById("conf-date").textContent = currentBooking.date || "Scheduled";
    document.getElementById("conf-time").textContent = currentBooking.time || "TBD";
    document.getElementById("conf-session-type").textContent = currentBooking.sessionType || "In-Person";
    document.getElementById("conf-reason").textContent = currentBooking.reason || "Study Support";
    document.getElementById("conf-student-name").textContent = currentBooking.studentName || "Student";
    document.getElementById("conf-student-id").textContent = currentBooking.studentId || "N/A";
    document.getElementById("conf-email").textContent = currentBooking.email || "N/A";

    const avatar = document.getElementById("tutor-avatar");
    if (avatar && currentBooking.tutor) {
        avatar.textContent = currentBooking.tutor.charAt(0);
    }

    // Adjust meeting location instructions
    const locationText = document.getElementById("location-text");
    if (locationText) {
        if (currentBooking.sessionType && currentBooking.sessionType.toLowerCase().includes("online")) {
            locationText.innerHTML = "This is an <strong>Online Session</strong>. A Microsoft Teams / Zoom invitation link will be sent to <strong>" + currentBooking.email + "</strong> 15 minutes before the start time.";
        } else {
            locationText.innerHTML = "Please arrive 5 minutes early at <strong>WelTec Petone Campus, Building B (Study Hub Room 204)</strong>.";
        }
    }

    // Print Receipt button handler
    const btnPrint = document.getElementById("btn-print-ticket");
    if (btnPrint) {
        btnPrint.addEventListener("click", function () {
            window.print();
        });
    }

    // Add to Calendar (.ics download) handler
    const btnCalendar = document.getElementById("btn-add-calendar");
    if (btnCalendar) {
        btnCalendar.addEventListener("click", function () {
            downloadCalendarFile(currentBooking);
        });
    }

    function downloadCalendarFile(booking) {
        const cleanDate = (booking.date || "2026-09-01").replace(/-/g, "");
        const startDateStr = `${cleanDate}T090000Z`;
        const endDateStr = `${cleanDate}T100000Z`;

        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Tutor Connect//Student Booking System//EN",
            "BEGIN:VEVENT",
            `UID:${booking.id}@tutorconnect.weltec.ac.nz`,
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
            `DTSTART:${startDateStr}`,
            `DTEND:${endDateStr}`,
            `SUMMARY:Tutoring Session: ${booking.subject} with ${booking.tutor}`,
            `DESCRIPTION:Student: ${booking.studentName} (ID: ${booking.studentId})\\nReason: ${booking.reason}\\nFormat: ${booking.sessionType}`,
            `LOCATION:${booking.sessionType.includes("Online") ? "Online (Teams/Zoom)" : "WelTec Petone Campus Room B-204"}`,
            "STATUS:CONFIRMED",
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\r\n");

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `TutorBooking_${booking.tutor.replace(/\s+/g, "_")}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
