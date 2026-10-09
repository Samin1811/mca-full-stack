const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const students = [];

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("studentName").value.trim();
  const id = document.getElementById("studentId").value.trim();
  const email = document.getElementById("studentEmail").value.trim();
  const course = document.getElementById("studentCourse").value.trim();
  const marks = Number(document.getElementById("studentMarks").value);

  if (!name || !id || !email || !course) {
    alert("Please fill in all student details.");
    return;
  }

  if (marks < 0 || marks > 100 || document.getElementById("studentMarks").value === "") {
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

  const student = { id, name, email, course, marks, result };
  students.push(student);
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

    [student.id, student.name, student.email, student.course,
      student.marks, student.result].forEach(function (value) {
      const cell = row.insertCell();
      cell.textContent = value;
    });
  });
}
