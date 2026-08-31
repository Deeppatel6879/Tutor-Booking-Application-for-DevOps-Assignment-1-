// Get the booking form elements

const bookingForm = document.getElementById("booking-form");
const bookingList = document.getElementById("booking-list");
const bookingCount = document.getElementById("booking-count");
const formMessage = document.getElementById("form-message");

const studentNameInput = document.getElementById("student-name");
const studentIdInput = document.getElementById("student-id");
const emailInput = document.getElementById("email");
const tutorInput = document.getElementById("tutor");
const subjectInput = document.getElementById("subject");
const bookingDateInput = document.getElementById("booking-date");
const bookingTimeInput = document.getElementById("booking-time");
const sessionTypeInput = document.getElementById("session-type");
const reasonInput = document.getElementById("reason");


// Load saved bookings from the browser

let bookings = JSON.parse(
    localStorage.getItem("tutorBookings")
) || [];


// Prevent users from selecting a date in the past

const today = new Date().toISOString().split("T")[0];

bookingDateInput.min = today;


// Read the selected tutor and subject from the homepage link

const pageParameters = new URLSearchParams(
    window.location.search
);

const selectedTutor = pageParameters.get("tutor");
const selectedSubject = pageParameters.get("subject");


// Automatically select the tutor

if (selectedTutor) {
    tutorInput.value = selectedTutor;
}


// Automatically select the subject

if (selectedSubject) {
    subjectInput.value = selectedSubject;
}


// Handle the booking form submission

bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const booking = {
        id: Date.now(),

        studentName: studentNameInput.value.trim(),

        studentId: studentIdInput.value.trim(),

        email: emailInput.value.trim(),

        tutor: tutorInput.value,

        subject: subjectInput.value,

        date: bookingDateInput.value,

        time: bookingTimeInput.value,

        sessionType: sessionTypeInput.value,

        reason: reasonInput.value.trim()
    };


    // Check that every field has been completed

    if (
        booking.studentName === "" ||
        booking.studentId === "" ||
        booking.email === "" ||
        booking.tutor === "" ||
        booking.subject === "" ||
        booking.date === "" ||
        booking.time === "" ||
        booking.sessionType === "" ||
        booking.reason === ""
    ) {
        showMessage(
            "Please complete every field before submitting.",
            "error"
        );

        return;
    }


    // Check the email address

    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!emailPattern.test(booking.email)) {
        showMessage(
            "Please enter a valid email address.",
            "error"
        );

        return;
    }


    // Check that the booking date is not in the past

    if (booking.date < today) {
        showMessage(
            "The booking date cannot be in the past.",
            "error"
        );

        return;
    }


    // Add the new booking

    bookings.push(booking);


    // Save and display the booking

    saveBookings();
    displayBookings();


    // Clear the form

    bookingForm.reset();


    // Show confirmation and redirect to ticket
    showMessage(
        'Your tutoring session has been booked successfully! Opening confirmation ticket...',
        "success"
    );

    setTimeout(function () {
        window.location.href = `confirmation.html?id=${booking.id}`;
    }, 1000);
});


// Save bookings in local storage

function saveBookings() {
    localStorage.setItem(
        "tutorBookings",
        JSON.stringify(bookings)
    );
}


// Display all current bookings

function displayBookings() {
    if (bookings.length === 0) {
        bookingCount.textContent =
            "Your confirmed bookings will appear here.";

        bookingList.innerHTML = `
            <div class="empty-bookings">
                <h3>No bookings yet</h3>

                <p>
                    Complete the form to arrange your first
                    tutoring session.
                </p>
            </div>
        `;

        return;
    }


    // Update the booking count

    if (bookings.length === 1) {
        bookingCount.textContent = "1 upcoming session";
    } else {
        bookingCount.textContent =
            bookings.length + " upcoming sessions";
    }


    // Clear the old booking display

    bookingList.innerHTML = "";


    // Create a card for each booking

    bookings.forEach(function (booking) {
        const bookingCard = document.createElement("article");

        bookingCard.className = "booking-card";

        bookingCard.innerHTML = `
            <div class="booking-details">

                <h3>
                    ${escapeText(booking.tutor)}
                </h3>

                <p>
                    <strong>Subject:</strong>
                    ${escapeText(booking.subject)}
                </p>

                <p>
                    <strong>Student:</strong>
                    ${escapeText(booking.studentName)}
                </p>

                <p>
                    <strong>Student ID:</strong>
                    ${escapeText(booking.studentId)}
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
                    <strong>Session type:</strong>
                    ${escapeText(booking.sessionType)}
                </p>

                <p>
                    <strong>Reason:</strong>
                    ${escapeText(booking.reason)}
                </p>

            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
                <a href="confirmation.html?id=${booking.id}" class="button secondary-button" style="padding: 8px 14px; font-size: 13px; text-decoration: none; text-align: center;">
                    View Ticket
                </a>
                <button
                    type="button"
                    class="cancel-button"
                    onclick="cancelBooking(${booking.id})"
                >
                    Cancel Booking
                </button>
            </div>
        `;

        bookingList.appendChild(bookingCard);
    });
}


// Cancel a booking

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

    showMessage(
        "The booking has been cancelled.",
        "success"
    );
}


// Show an error or success message

function showMessage(message, messageType) {
    formMessage.textContent = message;
    formMessage.className = messageType;
}


// Prevent entered text from being treated as HTML

function escapeText(value) {
    const temporaryElement = document.createElement("div");

    temporaryElement.textContent = value;

    return temporaryElement.innerHTML;
}


// Display previously saved bookings when the page loads

displayBookings();