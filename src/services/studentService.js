/* eslint-disable eqeqeq */
const KEYS = {
  students: "students",
  studentId: "studentId",
};

export const getDegreeCollection = () => [
  { id: "1", title: "Bachelor's degree (licență)" },
  { id: "2", title: "Master degree (disertație)" },
];

export function insertStudent(data) {
  console.log(data);
  let students = getAllStudents();
  data["id"] = generateStudentId();
  students.push(data);
  localStorage.setItem(KEYS.students, JSON.stringify(students));
}

export function updateStudent(data) {
  let students = getAllStudents();
  let recordIndex = students.findIndex((x) => x.id == data.id);
  students[recordIndex] = { ...data };
  localStorage.setItem(KEYS.students, JSON.stringify(students));
}

export function generateStudentId() {
  if (localStorage.getItem(KEYS.studentId) == null)
    localStorage.setItem(KEYS.studentId, "0");
  var id = parseInt(localStorage.getItem(KEYS.studentId));
  localStorage.setItem(KEYS.studentId, (++id).toString());
  return id;
}

export function getAllStudents() {
  if (localStorage.getItem(KEYS.students) == null)
    localStorage.setItem(KEYS.students, JSON.stringify([]));
  let students = JSON.parse(localStorage.getItem(KEYS.students));
  //map degreeID to degree title
  let degrees = getDegreeCollection();
  return students.map((x) => ({
    ...x,
    degree: degrees[x.degreeId - 1].title,
  }));
}
