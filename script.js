/* =========================================================
   CAMPUSMATE
   Student Companion App
   ========================================================= */


/* =========================
   DATA
========================= */

let courses =
    JSON.parse(localStorage.getItem("campusCourses")) || [];

let assignments =
    JSON.parse(localStorage.getItem("campusAssignments")) || [];

let timetable =
    JSON.parse(localStorage.getItem("campusTimetable")) || [];

let exams =
    JSON.parse(localStorage.getItem("campusExams")) || [];

let checklist =
    JSON.parse(localStorage.getItem("campusChecklist")) || [];

let announcements =
    JSON.parse(localStorage.getItem("campusAnnouncements")) || [];

let profile =
    JSON.parse(localStorage.getItem("campusProfile")) || {
        name: "",
        school: "",
        department: "",
        level: ""
    };


/* =========================
   HELPERS
========================= */

function saveData() {

    localStorage.setItem(
        "campusCourses",
        JSON.stringify(courses)
    );

    localStorage.setItem(
        "campusAssignments",
        JSON.stringify(assignments)
    );

    localStorage.setItem(
        "campusTimetable",
        JSON.stringify(timetable)
    );

    localStorage.setItem(
        "campusExams",
        JSON.stringify(exams)
    );

    localStorage.setItem(
        "campusChecklist",
        JSON.stringify(checklist)
    );

    localStorage.setItem(
        "campusAnnouncements",
        JSON.stringify(announcements)
    );

    localStorage.setItem(
        "campusProfile",
        JSON.stringify(profile)
    );
}


function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================
   NAVIGATION
========================= */

const navLinks =
    document.querySelectorAll(".nav-link");

const sections =
    document.querySelectorAll(".app-section");

const pageTitle =
    document.getElementById("page-title");


function showSection(sectionId) {

    sections.forEach(section => {
        section.classList.remove("active-section");
    });

    const section =
        document.getElementById(sectionId);

    if (section) {
        section.classList.add("active-section");
    }

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.dataset.section === sectionId) {
            link.classList.add("active");
        }

    });

    const titles = {
        dashboard: "Dashboard",
        courses: "My Courses",
        assignments: "Assignments",
        timetable: "Timetable",
        exams: "Exam Countdown",
        gpa: "GPA Calculator",
        checklist: "Study Checklist",
        announcements: "Announcements",
        profile: "My Profile"
    };

    pageTitle.textContent =
        titles[sectionId] || "CampusMate";

    document
        .getElementById("sidebar")
        .classList.remove("open");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


navLinks.forEach(link => {

    link.addEventListener("click", event => {

        event.preventDefault();

        showSection(link.dataset.section);

    });

});


document.querySelectorAll("[data-go]").forEach(button => {

    button.addEventListener("click", () => {

        showSection(button.dataset.go);

    });

});


/* =========================
   MOBILE MENU
========================= */

document
    .getElementById("menu-btn")
    .addEventListener("click", () => {

        document
            .getElementById("sidebar")
            .classList.toggle("open");

    });


/* =========================
   MODAL
========================= */

const modal =
    document.getElementById("modal");

const modalBody =
    document.getElementById("modal-body");

const closeModal =
    document.getElementById("close-modal");


function openModal(content) {

    modalBody.innerHTML = content;

    modal.classList.remove("hidden");

}


function closeModalFunction() {

    modal.classList.add("hidden");

    modalBody.innerHTML = "";

}


closeModal.addEventListener(
    "click",
    closeModalFunction
);


modal.addEventListener("click", event => {

    if (event.target === modal) {
        closeModalFunction();
    }

});


/* =========================
   COURSES
========================= */

document
    .getElementById("add-course-btn")
    .addEventListener("click", () => {

        openModal(`

            <h2>Add a Course</h2>

            <p>Add a course to your academic list.</p>

            <form id="course-form">

                <label>
                    Course Code
                    <input
                        id="course-code"
                        placeholder="e.g. HIS 401"
                        required
                    >
                </label>

                <label>
                    Course Title
                    <input
                        id="course-title"
                        placeholder="e.g. International Relations"
                        required
                    >
                </label>

                <label>
                    Course Unit
                    <input
                        id="course-unit"
                        type="number"
                        min="1"
                        max="10"
                        placeholder="3"
                        required
                    >
                </label>

                <button class="primary-btn">
                    Add Course
                </button>

            </form>

        `);


        document
            .getElementById("course-form")
            .addEventListener("submit", event => {

                event.preventDefault();

                courses.push({

                    id: Date.now(),

                    code:
                        document
                            .getElementById("course-code")
                            .value,

                    title:
                        document
                            .getElementById("course-title")
                            .value,

                    unit:
                        document
                            .getElementById("course-unit")
                            .value

                });

                saveData();

                renderCourses();

                updateDashboard();

                closeModalFunction();

                showToast("Course added successfully!");

            });

    });


function renderCourses() {

    const container =
        document.getElementById("courses-list");

    if (courses.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No courses added yet.
            </div>
        `;

        return;
    }


    container.innerHTML = courses.map(course => `

        <div class="course-card">

            <span class="course-code">
                ${course.code}
            </span>

            <h3>${course.title}</h3>

            <div class="card-meta">
                📚 ${course.unit} Credit Unit(s)
            </div>

            <div class="card-actions">

                <button
                    class="delete-btn"
                    onclick="deleteCourse(${course.id})"
                >
                    Delete
                </button>

            </div>

        </div>

    `).join("");

}


function deleteCourse(id) {

    courses =
        courses.filter(course => course.id !== id);

    saveData();

    renderCourses();

    updateDashboard();

    showToast("Course removed.");

}


/* =========================
   ASSIGNMENTS
========================= */

document
    .getElementById("add-assignment-btn")
    .addEventListener("click", () => {

        openModal(`

            <h2>Add Assignment</h2>

            <p>Keep track of your academic deadlines.</p>

            <form id="assignment-form">

                <label>
                    Assignment Title
                    <input
                        id="assignment-title"
                        placeholder="e.g. History Essay"
                        required
                    >
                </label>

                <label>
                    Course
                    <input
                        id="assignment-course"
                        placeholder="e.g. HIS 401"
                        required
                    >
                </label>

                <label>
                    Due Date
                    <input
                        id="assignment-date"
                        type="date"
                        required
                    >
                </label>

                <button class="primary-btn">
                    Add Assignment
                </button>

            </form>

        `);


        document
            .getElementById("assignment-form")
            .addEventListener("submit", event => {

                event.preventDefault();

                assignments.push({

                    id: Date.now(),

                    title:
                        document
                            .getElementById("assignment-title")
                            .value,

                    course:
                        document
                            .getElementById("assignment-course")
                            .value,

                    date:
                        document
                            .getElementById("assignment-date")
                            .value,

                    completed: false

                });

                saveData();

                renderAssignments();

                updateDashboard();

                closeModalFunction();

                showToast("Assignment added!");

            });

    });


function renderAssignments() {

    const container =
        document.getElementById("assignments-list");

    if (assignments.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No assignments added yet.
            </div>
        `;

        return;
    }


    const sorted =
        [...assignments].sort(
            (a, b) =>
                new Date(a.date) - new Date(b.date)
        );


    container.innerHTML = sorted.map(item => `

        <div class="task-card ${item.completed ? "completed" : ""}">

            <div class="task-info">

                <input
                    type="checkbox"
                    class="check-task"
                    ${item.completed ? "checked" : ""}
                    onchange="toggleAssignment(${item.id})"
                >

                <div>

                    <h3>${item.title}</h3>

                    <div class="card-meta">
                        📚 ${item.course}
                        <br>
                        📅 Due ${formatDate(item.date)}
                    </div>

                </div>

            </div>

            <button
                class="delete-btn"
                onclick="deleteAssignment(${item.id})"
            >
                Delete
            </button>

        </div>

    `).join("");

}


function toggleAssignment(id) {

    const item =
        assignments.find(a => a.id === id);

    if (item) {
        item.completed = !item.completed;
    }

    saveData();

    renderAssignments();

    updateDashboard();

}


function deleteAssignment(id) {

    assignments =
        assignments.filter(a => a.id !== id);

    saveData();

    renderAssignments();

    updateDashboard();

    showToast("Assignment removed.");

}


/* =========================
   TIMETABLE
========================= */

document
    .getElementById("add-class-btn")
    .addEventListener("click", () => {

        openModal(`

            <h2>Add Class</h2>

            <p>Add a class to your weekly timetable.</p>

            <form id="class-form">

                <label>
                    Course
                    <input
                        id="class-course"
                        placeholder="e.g. HIS 401"
                        required
                    >
                </label>

                <label>
                    Day
                    <select id="class-day" required>

                        <option value="">
                            Select day
                        </option>

                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>

                    </select>
                </label>

                <label>
                    Time
                    <input
                        id="class-time"
                        placeholder="10:00 AM"
                        required
                    >
                </label>

                <label>
                    Venue
                    <input
                        id="class-venue"
                        placeholder="e.g. Lecture Hall 2"
                    >
                </label>

                <button class="primary-btn">
                    Add Class
                </button>

            </form>

        `);


        document
            .getElementById("class-form")
            .addEventListener("submit", event => {

                event.preventDefault();

                timetable.push({

                    id: Date.now(),

                    course:
                        document
                            .getElementById("class-course")
                            .value,

                    day:
                        document
                            .getElementById("class-day")
                            .value,

                    time:
                        document
                            .getElementById("class-time")
                            .value,

                    venue:
                        document
                            .getElementById("class-venue")
                            .value

                });

                saveData();

                renderTimetable();

                updateDashboard();

                closeModalFunction();

                showToast("Class added!");

            });

    });


function renderTimetable() {

    const container =
        document.getElementById("timetable-list");

    if (timetable.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No classes added yet.
            </div>
        `;

        return;
    }


    container.innerHTML = timetable.map(item => `

        <div class="class-card">

            <span class="eyebrow">
                ${item.day}
            </span>

            <h3>${item.course}</h3>

            <div class="card-meta">
                🕐 ${item.time}
                <br>
                📍 ${item.venue || "Venue not added"}
            </div>

            <div class="card-actions">

                <button
                    class="delete-btn"
                    onclick="deleteClass(${item.id})"
                >
                    Delete
                </button>

            </div>

        </div>

    `).join("");

}


function deleteClass(id) {

    timetable =
        timetable.filter(item => item.id !== id);

    saveData();

    renderTimetable();

    updateDashboard();

    showToast("Class removed.");

}


/* =========================
   EXAMS
========================= */

document
    .getElementById("add-exam-btn")
    .addEventListener("click", () => {

        openModal(`

            <h2>Add Exam</h2>

            <p>Set an exam date and start your countdown.</p>

            <form id="exam-form">

                <label>
                    Course
                    <input
                        id="exam-course"
                        placeholder="e.g. HIS 405"
                        required
                    >
                </label>

                <label>
                    Exam Date
                    <input
                        id="exam-date"
                        type="date"
                        required
                    >
                </label>

                <label>
                    Exam Time
                    <input
                        id="exam-time"
                        type="time"
                    >
                </label>

                <button class="primary-btn">
                    Add Exam
                </button>

            </form>

        `);


        document
            .getElementById("exam-form")
            .addEventListener("submit", event => {

                event.preventDefault();

                exams.push({

                    id: Date.now(),

                    course:
                        document
                            .getElementById("exam-course")
                            .value,

                    date:
                        document
                            .getElementById("exam-date")
                            .value,

                    time:
                        document
                            .getElementById("exam-time")
                            .value

                });

                saveData();

                renderExams();

                updateDashboard();

                closeModalFunction();

                showToast("Exam added!");

            });

    });


function getDaysRemaining(date) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const examDate = new Date(date);

    examDate.setHours(0, 0, 0, 0);

    const difference =
        examDate - today;

    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );
}


function renderExams() {

    const container =
        document.getElementById("exams-list");

    if (exams.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No exams added yet.
            </div>
        `;

        return;
    }


    const sorted =
        [...exams].sort(
            (a, b) =>
                new Date(a.date) - new Date(b.date)
        );


    container.innerHTML = sorted.map(exam => {

        const days =
            getDaysRemaining(exam.date);

        let countdownText;

        if (days < 0) {
            countdownText = "Exam completed";
        } else if (days === 0) {
            countdownText = "Exam is today! 🔥";
        } else if (days === 1) {
            countdownText = "1 day left";
        } else {
            countdownText = `${days} days left`;
        }


        return `

            <div class="exam-card">

                <span class="eyebrow">
                    EXAM COUNTDOWN
                </span>

                <h3>${exam.course}</h3>

                <div class="exam-date">
                    📅 ${formatDate(exam.date)}
                </div>

                <div class="countdown">
                    ${countdownText}
                </div>

                ${
                    exam.time
                    ? `<div class="card-meta">
                        🕐 ${exam.time}
                       </div>`
                    : ""
                }

                <div class="card-actions">

                    <button
                        class="delete-btn"
                        onclick="deleteExam(${exam.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `;

    }).join("");

}


function deleteExam(id) {

    exams =
        exams.filter(exam => exam.id !== id);

    saveData();

    renderExams();

    updateDashboard();

    showToast("Exam removed.");

}


/* =========================
   GPA CALCULATOR
========================= */

const gpaRows =
    document.getElementById("gpa-rows");


function addGPARow() {

    const row =
        document.createElement("div");

    row.className = "gpa-row";

    row.innerHTML = `

        <input
            class="gpa-course"
            placeholder="Course"
        >

        <input
            class="gpa-unit"
            type="number"
            min="1"
            placeholder="Unit"
        >

        <select class="gpa-grade">

            <option value="">Grade</option>
            <option value="5">A</option>
            <option value="4">B</option>
            <option value="3">C</option>
            <option value="2">D</option>
            <option value="1">E</option>
            <option value="0">F</option>

        </select>

        <button
            class="delete-btn remove-gpa"
            type="button"
        >
            ✕
        </button>

    `;


    row.querySelector(".remove-gpa")
        .addEventListener("click", () => {

            row.remove();

        });


    gpaRows.appendChild(row);

}


document
    .getElementById("add-gpa-row")
    .addEventListener("click", addGPARow);


for (let i = 0; i < 3; i++) {
    addGPARow();
}


document
    .getElementById("calculate-gpa")
    .addEventListener("click", calculateGPA);


function calculateGPA() {

    const rows =
        document.querySelectorAll(".gpa-row");

    let totalPoints = 0;

    let totalUnits = 0;


    rows.forEach(row => {

        const unit =
            Number(
                row.querySelector(".gpa-unit").value
            );

        const grade =
            Number(
                row.querySelector(".gpa-grade").value
            );

        if (
            unit &&
            !isNaN(grade)
        ) {

            totalUnits += unit;

            totalPoints +=
                unit * grade;

        }

    });


    if (totalUnits === 0) {

        document.getElementById("gpa-result")
            .textContent = "0.00";

        document.getElementById("gpa-message")
            .textContent =
                "Add your courses to calculate your GPA.";

        return;

    }


    const gpa =
        totalPoints / totalUnits;


    const rounded =
        gpa.toFixed(2);


    document.getElementById("gpa-result")
        .textContent = rounded;


    let message;

    if (gpa >= 4.5) {

        message = "Outstanding! Keep going! 🏆";

    } else if (gpa >= 3.5) {

        message = "Excellent performance! 🌟";

    } else if (gpa >= 2.5) {

        message = "Good job. Keep improving! 💪🏽";

    } else if (gpa >= 2.0) {

        message = "You're getting there. Keep studying! 📚";

    } else {

        message = "Don't give up. You can improve! ❤️";

    }


    document.getElementById("gpa-message")
        .textContent = message;


    document.getElementById("dashboard-gpa")
        .textContent = rounded;

}


/* =========================
   CHECKLIST
========================= */

document
    .getElementById("checklist-form")
    .addEventListener("submit", event => {

        event.preventDefault();

        const input =
            document.getElementById("checklist-input");

        const text =
            input.value.trim();

        if (!text) return;


        checklist.push({

            id: Date.now(),

            text: text,

            done: false

        });


        input.value = "";

        saveData();

        renderChecklist();

        showToast("Study task added!");

    });


function renderChecklist() {

    const container =
        document.getElementById("checklist-list");


    if (checklist.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No study tasks yet.
            </div>
        `;

        return;

    }


    container.innerHTML =
        checklist.map(item => `

            <div class="checklist-item ${item.done ? "done" : ""}">

                <div>

                    <input
                        type="checkbox"
                        ${item.done ? "checked" : ""}
                        onchange="toggleChecklist(${item.id})"
                    >

                    <span>
                        ${item.text}
                    </span>

                </div>

                <button
                    class="delete-btn"
                    onclick="deleteChecklist(${item.id})"
                >
                    Delete
                </button>

            </div>

        `).join("");

}


function toggleChecklist(id) {

    const item =
        checklist.find(item => item.id === id);

    if (item) {
        item.done = !item.done;
    }

    saveData();

    renderChecklist();

}


function deleteChecklist(id) {

    checklist =
        checklist.filter(item => item.id !== id);

    saveData();

    renderChecklist();

    showToast("Task removed.");

}


/* =========================
   ANNOUNCEMENTS
========================= */

document
    .getElementById("add-announcement-btn")
    .addEventListener("click", () => {

        openModal(`

            <h2>Add Announcement</h2>

            <p>Save an important campus or class update.</p>

            <form id="announcement-form">

                <label>
                    Title
                    <input
                        id="announcement-title"
                        placeholder="e.g. Departmental Meeting"
                        required
                    >
                </label>

                <label>
                    Message
                    <textarea
                        id="announcement-message"
                        rows="5"
                        placeholder="Write announcement..."
                        required
                    ></textarea>
                </label>

                <button class="primary-btn">
                    Add Announcement
                </button>

            </form>

        `);


        document
            .getElementById("announcement-form")
            .addEventListener("submit", event => {

                event.preventDefault();

                announcements.push({

                    id: Date.now(),

                    title:
                        document
                            .getElementById("announcement-title")
                            .value,

                    message:
                        document
                            .getElementById("announcement-message")
                            .value,

                    date:
                        new Date().toISOString()

                });

                saveData();

                renderAnnouncements();

                closeModalFunction();

                showToast("Announcement added!");

            });

    });


function renderAnnouncements() {

    const container =
        document.getElementById("announcements-list");


    if (announcements.length === 0) {

        container.innerHTML = `

            <div class="empty-state">
                No announcements yet.
            </div>

        `;

        return;

    }


    container.innerHTML =
        announcements.map(item => `

            <div class="announcement-card">

                <div class="announcement-date">
                    ${formatDate(item.date)}
                </div>

                <h3>${item.title}</h3>

                <p>${item.message}</p>

                <div class="card-actions">

                    <button
                        class="delete-btn"
                        onclick="deleteAnnouncement(${item.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `).join("");

}


function deleteAnnouncement(id) {

    announcements =
        announcements.filter(
            item => item.id !== id
        );

    saveData();

    renderAnnouncements();

    showToast("Announcement removed.");

}


/* =========================
   PROFILE
========================= */

function renderProfile() {

    const name =
        profile.name || "Student";

    const school =
        profile.school || "Your University";


    document.getElementById(
        "top-user-name"
    ).textContent = name;


    document.getElementById(
        "profile-display-name"
    ).textContent = name;


    document.getElementById(
        "profile-display-school"
    ).textContent = school;


    document.getElementById(
        "profile-avatar"
    ).textContent =
        name.charAt(0).toUpperCase();


    document.querySelector(".avatar")
        .textContent =
        name.charAt(0).toUpperCase();


    document.getElementById(
        "profile-name"
    ).value =
        profile.name;


    document.getElementById(
        "profile-school"
    ).value =
        profile.school;


    document.getElementById(
        "profile-department"
    ).value =
        profile.department;


    document.getElementById(
        "profile-level"
    ).value =
        profile.level;

}


document
    .getElementById("profile-form")
    .addEventListener("submit", event => {

        event.preventDefault();

        profile = {

            name:
                document
                    .getElementById("profile-name")
                    .value.trim(),

            school:
                document
                    .getElementById("profile-school")
                    .value.trim(),

            department:
                document
                    .getElementById("profile-department")
                    .value.trim(),

            level:
                document
                    .getElementById("profile-level")
                    .value

        };


        saveData();

        renderProfile();

        showToast("Profile saved successfully!");

    });


document
    .getElementById("profile-shortcut")
    .addEventListener("click", () => {

        showSection("profile");

    });


/* =========================
   SEARCH
========================= */

const searchBox =
    document.getElementById("search-box");


document
    .getElementById("search-btn")
    .addEventListener("click", () => {

        searchBox.classList.remove("hidden");

        document
            .getElementById("global-search")
            .focus();

    });


document
    .getElementById("close-search")
    .addEventListener("click", () => {

        searchBox.classList.add("hidden");

    });


document
    .getElementById("global-search")
    .addEventListener("input", event => {

        const query =
            event.target.value
                .toLowerCase()
                .trim();


        const results =
            document.getElementById("search-results");


        if (!query) {

            results.innerHTML = "";

            return;

        }


        const matches = [];


        courses.forEach(course => {

            if (
                course.title
                    .toLowerCase()
                    .includes(query) ||

                course.code
                    .toLowerCase()
                    .includes(query)
            ) {

                matches.push(
                    `📚 Course: ${course.title}`
                );

            }

        });


        assignments.forEach(item => {

            if (
                item.title
                    .toLowerCase()
                    .includes(query)
            ) {

                matches.push(
                    `📝 Assignment: ${item.title}`
                );

            }

        });


        exams.forEach(item => {

            if (
                item.course
                    .toLowerCase()
                    .includes(query)
            ) {

                matches.push(
                    `⏳ Exam: ${item.course}`
                );

            }

        });


        timetable.forEach(item => {

            if (
                item.course
                    .toLowerCase()
                    .includes(query)
            ) {

                matches.push(
                    `🗓️ Class: ${item.course}`
                );

            }

        });


        if (matches.length === 0) {

            results.innerHTML = `
                <div class="search-result">
                    No results found.
                </div>
            `;

            return;

        }


        results.innerHTML =
            matches.map(result => `

                <div class="search-result">
                    ${result}
                </div>

            `).join("");

    });


/* =========================
   DARK MODE
========================= */

function toggleDarkMode() {

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "campusDarkMode",
        dark
    );

    document.getElementById(
        "theme-toggle"
    ).innerHTML =
        dark
        ? "☀️ <span>Light Mode</span>"
        : "🌙 <span>Dark Mode</span>";

}


document
    .getElementById("theme-toggle")
    .addEventListener(
        "click",
        toggleDarkMode
    );


document
    .getElementById("mobile-theme")
    .addEventListener(
        "click",
        toggleDarkMode
    );


if (
    localStorage.getItem("campusDarkMode")
    === "true"
) {

    document.body.classList.add("dark");

}


/* =========================
   NOTIFICATIONS
========================= */

document
    .getElementById("notification-btn")
    .addEventListener("click", () => {

        const pendingAssignments =
            assignments.filter(
                item => !item.completed
            ).length;


        const upcomingExams =
            exams.filter(
                exam => getDaysRemaining(exam.date) >= 0
            ).length;


        alert(
            `CampusMate Notifications\n\n` +

            `📝 ${pendingAssignments} pending assignment(s)\n` +

            `⏳ ${upcomingExams} upcoming exam(s)`
        );

    });


/* =========================
   CLEAR DATA
========================= */

document
    .getElementById("clear-data")
    .addEventListener("click", () => {

        const confirmed =
            confirm(
                "Are you sure you want to clear all CampusMate data?"
            );


        if (!confirmed) return;


        localStorage.clear();

        location.reload();

    });


/* =========================
   DASHBOARD
========================= */

function updateDashboard() {

    document.getElementById(
        "course-count"
    ).textContent =
        courses.length;


    document.getElementById(
        "assignment-count"
    ).textContent =
        assignments.filter(
            item => !item.completed
        ).length;


    document.getElementById(
        "exam-count"
    ).textContent =
        exams.filter(
            exam => getDaysRemaining(exam.date) >= 0
        ).length;


    renderDashboardExams();

    renderDashboardAssignments();

    renderDashboardSchedule();

}


function renderDashboardExams() {

    const container =
        document.getElementById(
            "dashboard-exams"
        );


    const upcoming =
        exams
            .filter(
                exam =>
                    getDaysRemaining(exam.date) >= 0
            )
            .sort(
                (a, b) =>
                    new Date(a.date)
                    -
                    new Date(b.date)
            )
            .slice(0, 3);


    if (upcoming.length === 0) {

        container.innerHTML =
            "No upcoming exams.";

        return;

    }


    container.innerHTML =
        upcoming.map(exam => `

            <div class="task-card">

                <div>

                    <strong>
                        ${exam.course}
                    </strong>

                    <div class="card-meta">
                        ${formatDate(exam.date)}
                    </div>

                </div>

                <strong>
                    ${getDaysRemaining(exam.date)}d
                </strong>

            </div>

        `).join("");

}


function renderDashboardAssignments() {

    const container =
        document.getElementById(
            "dashboard-assignments"
        );


    const pending =
        assignments
            .filter(
                item => !item.completed
            )
            .sort(
                (a, b) =>
                    new Date(a.date)
                    -
                    new Date(b.date)
            )
            .slice(0, 3);


    if (pending.length === 0) {

        container.innerHTML =
            "No pending assignments.";

        return;

    }


    container.innerHTML =
        pending.map(item => `

            <div class="task-card">

                <div>

                    <strong>
                        ${item.title}
                    </strong>

                    <div class="card-meta">
                        ${item.course}
                    </div>

                </div>

                <span class="card-meta">
                    ${formatDate(item.date)}
                </span>

            </div>

        `).join("");

}


function renderDashboardSchedule() {

    const container =
        document.getElementById(
            "dashboard-schedule"
        );


    const today =
        new Date().toLocaleDateString(
            "en-US",
            { weekday: "long" }
        );


    const todayClasses =
        timetable.filter(
            item => item.day === today
        );


    if (todayClasses.length === 0) {

        container.innerHTML =
            `No classes added for ${today}.`;

        return;

    }


    container.innerHTML =
        todayClasses.map(item => `

            <div class="class-card">

                <strong>
                    ${item.course}
                </strong>

                <div class="card-meta">
                    🕐 ${item.time}
                    <br>
                    📍 ${item.venue}
                </div>

            </div>

        `).join("");

}


/* =========================
   DATE FORMAT
========================= */

function formatDate(date) {

    if (!date) return "";

    const parsed =
        new Date(date);

    return parsed.toLocaleDateString(
        "en-US",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================
   INITIALIZE APP
========================= */

renderCourses();

renderAssignments();

renderTimetable();

renderExams();

renderChecklist();

renderAnnouncements();

renderProfile();

updateDashboard();