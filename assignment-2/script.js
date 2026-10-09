const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const message = document.getElementById("message");

const STORAGE_KEY = "students";
let students = [];

// Load previously saved student records.
try {
    const savedStudents = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (Array.isArray(savedStudents)) {
        students = savedStudents;
    }
} catch (error) {
    students = [];
}

// Register a student when the form is submitted.
studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const id = document.getElementById("studentId").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const course = document.getElementById("studentCourse").value.trim();

    const mathsInput = document.getElementById("studentMaths").value;
    const javaInput = document.getElementById("studentJava").value;
    const pythonInput = document.getElementById("studentPython").value;

    const maths = Number(mathsInput);
    const java = Number(javaInput);
    const python = Number(pythonInput);

    // Validate student details.
    if (!name || !id || !email || !course) {
        showMessage("Please fill in all student details.", true);
        return;
    }

    // Validate email.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage("Please enter a valid email address.", true);
        return;
    }

    // Validate marks.
    const marksInputs = [mathsInput, javaInput, pythonInput];
    const marks = [maths, java, python];

    const invalidMarks = marksInputs.some(function (input, index) {
        return (
            input === "" ||
            !Number.isFinite(marks[index]) ||
            !Number.isInteger(marks[index]) ||
            marks[index] < 0 ||
            marks[index] > 100
        );
    });

    if (invalidMarks) {
        showMessage(
            "Each subject's marks must be a whole number from 0 to 100.",
            true
        );
        return;
    }

    // Prevent duplicate Student IDs.
    const duplicate = students.some(function (student) {
        return String(student.id).toLowerCase() === id.toLowerCase();
    });

    if (duplicate) {
        showMessage("This Student ID is already registered.", true);
        return;
    }

    // Calculate total and percentage.
    const total = maths + java + python;
    const percentage = Number((total / 3).toFixed(2));

    // A student must score at least 40 in every subject to pass.
    const result =
        maths >= 40 && java >= 40 && python >= 40
            ? "Pass"
            : "Fail";

    // Create the student object.
    const student = {
        id: id,
        name: name,
        email: email,
        course: course,
        maths: maths,
        java: java,
        python: python,
        total: total,
        percentage: percentage,
        result: result
    };

    // Save the student and update Local Storage.
    students.push(student);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (error) {
        students.pop();
        showMessage(
            "Could not save the record. Please check your browser storage.",
            true
        );
        return;
    }

    renderStudents();
    studentForm.reset();

    showMessage(
        "Student registered successfully! Result: " + result,
        false
    );
});

// Display a message to the user.
function showMessage(text, isError) {
    message.textContent = text;
    message.style.color = isError ? "#dc2626" : "#15803d";
}

// Display all student records in the table.
function renderStudents() {
    studentTable.replaceChildren();

    if (students.length === 0) {
        const row = studentTable.insertRow();
        const cell = row.insertCell();

        cell.colSpan = 10;
        cell.textContent = "No students registered yet.";

        return;
    }

    students.forEach(function (student) {
        const row = studentTable.insertRow();

        const values = [
            student.id,
            student.name,
            student.email,
            student.course,
            student.maths ?? "-",
            student.java ?? "-",
            student.python ?? "-",
            student.total ?? "-",
            student.percentage !== undefined
                ? student.percentage + "%"
                : "-",
            student.result
        ];

        values.forEach(function (value, index) {
            const cell = row.insertCell();
            cell.textContent = value;

            if (index === 9) {
                cell.className =
                    student.result === "Pass" ? "pass" : "fail";
            }
        });
    });
}

// Load existing records when the page opens.
renderStudents();
