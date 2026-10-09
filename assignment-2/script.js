const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");

const STORAGE_KEY = "students";
let students = [];

try {
  students = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (!Array.isArray(students)) {
    students = [];
  }
} catch (error) {
  students = [];
}

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("studentName").value.trim();
  const id = document.getElementById("studentId").value.trim();
  const email = document.getElementById("studentEmail").value.trim();
  const course = document.getElementById("studentCourse").value.trim();
  const marksInput = document.getElementById("studentMarks").value;
  const marks = Number(marksInput);

  if (!name || !id || !email || !course) {
    alert("Please fill in all student details.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (
    marksInput === "" ||
    !Number.isFinite(marks) ||
    marks < 0 ||
    marks > 100
  ) {
    alert("Marks must be between 0 and 100.");
    return;
  }

  const duplicate = students.some(function (student) {
    return student.id.toLowerCase() === id.toLowerCase();
  });

  if (duplicate) {
    alert("This Student ID is already registered.");
    return;
  }

  const result = marks >= 40 ? "Pass" : "Fail";

  const student = {
    id: id,
    name: name,
    email: email,
    course: course,
    marks: marks,
    percentage: marks,
    result: result
  };

  students.push(student);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));

  renderStudents();
  studentForm.reset();
});

function renderStudents() {
  studentTable.replaceChildren();

  if (students.length === 0) {
    const row = studentTable.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 6;
    cell.textContent = "No students registered yet.";
    return;
  }

  students.forEach(function (student) {
    const row = studentTable.insertRow();

    [
      student.id,
      student.name,
      student.email,
      student.course,
      student.marks,
      student.result
    ].forEach(function (value) {
      const cell = row.insertCell();
      cell.textContent = value;
    });
  });
}

renderStudents();
