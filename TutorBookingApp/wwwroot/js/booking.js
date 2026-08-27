const bookingForm = document.getElementById("booking-form");
const bookingList = document.getElementById("booking-list");
const bookingCount = document.getElementById("booking-count");
const formMessage = document.getElementById("form-message");

let bookings = JSON.parse(
    localStorage.getItem("tutorBookings")
) || [];

const dateInput = document.getElementById("booking-date");

dateInput.min = new Date().toISOString().split("T")[0];

/*
    Read the tutor and subject from the home-page link.
    Example:
    booking.html?tutor=Sarah%20Williams&subject=Programming
*/

const pageParameters = new URLSearchParams(window.location.search);

const selectedTutor = pageParameters.get("tutor");
const selectedSubject = pageParameters.get("subject");

if (selectedTutor) {
    document.getElementById("tutor").value = selectedTutor;
}

if (selectedSubject) {
    document.getElementById("subject").value = selectedSubject;
}

/*
    Submit the booking form
*/

bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const booking = {
        id: Date.now(),

        studentName: document
            .getElementById("student-name")
            .value
            .trim(),

        studentId: document
            .getElementById("student-id")
            .value
            .trim(),

        email: document
            .getElementById("email")
            .value
            .trim(),

        tutor: document.getElementById("tutor").value,

        subject: document.getElementById("subject").value,

        date: document.getElementById("booking-date").value,

        time: document.getElementById("booking-time").value,

        sessionType: document
            .getElementById("session-type")
            .value,

        reason: document
            .getElementById("reason")
            .value
            .trim()
    };

    const requiredValues = [
        booking.studentName,
        booking.studentId,
        booking.email,
        booking.tutor,
        booking.subject,
        booking.date,
        booking.time,
        booking.sessionType,
        booking.reason
    ];

    if (requiredValues.some(function (value) {
        return value === "";
    })) {
        showMessage(
            "Please complete every field before submitting.",
            "error"
        );

        return;
    }

    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!emailPattern.test(booking.email)) {
        showMessage(
            "Please enter a valid email address.",
            "error"
        );

        return;
    }

    const today = new Date()
        .toISOString()
        .split("T")[0];

    if (booking.date < today) {
        showMessage(
            "The booking date cannot be in the past.",
            "error"
        );

        return;
    }

    bookings.push(booking);

    saveBookings();
    displayBookings();

    bookingForm.reset();

    showMessage(
        "Your tutoring session has been booked successfully.",
        "success"
    );
});

/*
    Save bookings in the browser
*/

function saveBookings() {
    localStorage.setItem(
        "tutorBookings",
        JSON.stringify(bookings)
    );
}

/*
    Display the saved bookings
*/

function displayBookings() {
    if (bookings.length === 0) {
        bookingCount.textContent =
            "Your confirmed bookings will appear here.";

        bookingList.innerHTML = `
            <div class="empty-bookings">
                <h3>No bookings yet</h3>

                <p>
                    Complete the booking form to arrange your
                    first tutoring session.
                </p>
            </div>
        `;

        return;
    }

    bookingCount.textContent =
        bookings.length +
        (bookings.length === 1
            ? " upcoming session"
            : " upcoming sessions");

    bookingList.innerHTML = "";

    bookings.forEach(function (booking) {
        const bookingCard = document.createElement("article");

        bookingCard.className = "booking-card";

        bookingCard.innerHTML = `
            <div>
                <h3>${escapeText(booking.tutor)}</h3>

                <p>
                    <strong>Subject:</strong>
                    ${escapeText(booking.subject)}
                </p>

                <p>
                    <strong>Student:</strong>
                    ${escapeText(booking.studentName)}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${escapeText(booking.date)}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${escapeText(booking.time)}
                </p>

                <p>
                    <strong>Session:</strong>
                    ${escapeText(booking.sessionType)}
                </p>
            </div>

            <button
                type="button"
                class="cancel-button"
                onclick="cancelBooking(${booking.id})"
            >
                Cancel Booking
            </button>
        `;

        bookingList.appendChild(bookingCard);
    });
}

/*
    Cancel a booking
*/

function cancelBooking(bookingId) {
    const confirmed = confirm(
        "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
        return;
    }

    bookings = bookings.filter(function (booking) {
        return booking.id !== bookingId;
    });

    saveBookings();
    displayBookings();
}

/*
    Display validation or confirmation messages
*/

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = type;
}

/*
    Prevent form information from being inserted as HTML
*/

function escapeText(value) {
    const temporaryElement = document.createElement("div");

    temporaryElement.textContent = value;

    return temporaryElement.innerHTML;
}

displayBookings();