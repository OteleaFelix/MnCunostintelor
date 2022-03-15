/* eslint-disable eqeqeq */
import React, { useRef, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import SignatureCanvas from "react-signature-canvas";
import { useForm, Form } from "../../components/useForm";
import * as studentService from "../../services/studentService";
import { TextField } from "@material-ui/core";

const genderItems = [
  { id: "masculin", title: "masculin" },
  { id: "feminin", title: "feminin" },
  { id: "Altul", title: "altul" },
];

const studyTypes = [
  { id: "IFR", title: "IFR" },
  { id: "ID", title: "ID" },
  { id: "IF", title: "IF" },
];



const facultyTypes = [
  {
    key: 1,
    id: "de Design de produs și mediu",
    title: "Facultatea de Design de produs și mediu",
  },
  {
    key: 2,
    id: "de Inginerie electrică și știința calculatoarelor",
    title: "Facultatea de Inginerie electrică și știința calculatoarelor",
  },
  {
    key: 3,
    id: "de Design de mobilier și inginerie a lemnului",
    title: "Facultatea de Design de mobilier și inginerie a lemnului",
  },
  {
    key: 4,
    id: "de Inginerie mecanică",
    title: "Facultatea de Inginerie mecanică",
  },
  {
    key: 4,
    id: "de Inginerie tehnologică și management industrial",
    title: "Facultatea de Inginerie tehnologică și management industrial",
  },
  {
    key: 5,
    id: "de Silvicultură și exploatări forestiere",
    title: " Facultatea de Silvicultură și exploatări forestiere",
  },
  {
    key: 6,
    id: "de Știinta și ingineria materialelor",
    title: " Facultatea de Știinta și ingineria materialelor",
  },
  { key: 7, id: "de Drept", title: " Facultatea de Drept" },
  {
    key: 8,
    id: "de Educație fizică și sporturi montane",
    title: " Facultatea de Educație fizică și sporturi montane",
  },
  { key: 9, id: "de Litere", title: " Facultatea de Litere" },
  {
    key: 10,
    id: "de Matematică și informatică",
    title: " Facultatea de Matematică și informatică",
  },
  { key: 11, id: "de Medicină", title: " Facultatea de Medicină" },
  { id: "de Muzică", title: " Facultatea de Muzică" },
  {
    key: 12,
    id: "de Psihologie și științele educației",
    title: " Facultatea de Psihologie și științele educației",
  },
  {
    key: 13,
    id: "de Sociologie și comunicare",
    title: " Facultatea de Sociologie și comunicare",
  },
  {
    key: 14,
    id: "de Științe economice și administrarea afacerilor",
    title: " Facultatea de Științe economice și administrarea afacerilor",
  },
  {
    key: 15,
    id: "de Alimentație și turism",
    title: "Facultatea de Alimentație și turism",
  },
  { key: 16, id: "de Construcții", title: "Facultatea de Construcții" },
];

const initialFValues = {
  user_id: undefined,
  document_id: undefined,
  full_name: "",
  email: "",
  mobile: "",
  city: "",
  gender: "male",
  degree_id: "",
  study_program: "",
  year_of_study: "",
  exam_date: null,
  frequency: "",
  anexa2: undefined,
  anexa4: undefined,
  anexa6: undefined,
  anexa7: undefined,
  anexa8: undefined,
  signuture: undefined,
  group: "",
  faculty: "",
  theme: "",
  profesor: "",
  dateAnexa2: null,
  date2Anexa2: null,
  profesorSignuture: undefined,
  checkboxObligatii:false,
  checkboxCorectitudine:false
};

export default function StudentForm(props) {
  const { addOrEdit, recordForEdit } = props;
  const refStudent = useRef();
  const refProfesor = useRef();

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("full_name" in fieldValues)
      temp.full_name = fieldValues.full_name ? "" : "Câmp obligatoriu.";
    if ("email" in fieldValues)
      temp.email = /$^|.+@student.unitbv.ro/.test(fieldValues.email)
        ? ""
        : "Email-ul nu este valid.";
    if ("mobile" in fieldValues)
      temp.mobile =
        fieldValues.mobile.length == 10 ? "" : "10 numere";
    if ("degreeId" in fieldValues)
      temp.degreeId =
        fieldValues.degreeId.length != 0 ? "" : "Câmp obligatoriu.";
    if ("study_program" in fieldValues)
      temp.study_program = fieldValues.study_program
        ? ""
        : "Câmp obligatoriu.";
    if ("year_of_study" in fieldValues)
      temp.year_of_study =
        fieldValues.year_of_study < 7
          ? ""
          : "Intervalul de ani trebuie să fie între 1 to 6";
    if ("checkboxObligatii" in fieldValues)
       fieldValues.checkboxObligatii = false ? "" : "Obligatoriu.";
    if ("checkboxCorectitudine" in fieldValues)
      fieldValues.checkboxCorectitudine= false ? "" : "Obligatoriu.";
    // if ("anexa2" in fieldValues) {
    //   temp.anexa2 = fieldValues.anexa2 ? "" : "This field is required.";
    // }
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    e.preventDefault();
    let signitureStudent = refStudent.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    let signitureProfesor = refProfesor.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    if (validate()) {
      console.log({ values });
      addOrEdit(
        values,
        resetForm,
        !refStudent.current.isEmpty() && signitureStudent,
        !refProfesor.current.isEmpty() && signitureProfesor
      );
    }
  };

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit, setValues]);

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            name="full_name"
            label="Nume complet"
            value={values.full_name}
            onChange={handleInputChange}
            error={errors.full_name}
          />
          <Controls.Input
            label="Email"
            name="email"
            value={values.email}
            onChange={handleInputChange}
            error={errors.email}
          />
          <Controls.Input
            name="study_program"
            label="Program de studii"
            value={values.study_program}
            onChange={handleInputChange}
            error={errors.study_program}
          />
          <Controls.Input
            name="group"
            label="Grupa"
            value={values.group}
            onChange={handleInputChange}
            error={errors.group}
          />
          <Controls.Select
            name="faculty"
            label="Facultate"
            value={values.faculty}
            onChange={handleInputChange}
            options={facultyTypes}
            error={errors.faculty}
          />
          <Controls.Input
            label="Anul de studiu"
            name="year_of_study"
            value={values.year_of_study}
            onChange={handleInputChange}
            error={errors.year_of_study}
          />

          <Controls.Input
            label="Mobil"
            name="mobile"
            value={values.mobile}
            onChange={handleInputChange}
            error={errors.mobile}
          />
          <Controls.Input
            label="Oraș"
            name="city"
            value={values.city}
            onChange={handleInputChange}
          />
          <Controls.Input
            label="Conducător științific"
            name="profesor"
            value={values.profesor}
            onChange={handleInputChange}
            error={errors.profesor}
          />
          <Controls.RadioGroup
            name="gender"
            label="Gen"
            value={values.gender}
            onChange={handleInputChange}
            items={genderItems}
          />
          <Controls.Select
            name="degree_id"
            label="Tipul de diplomă"
            value={values.degree_id}
            onChange={handleInputChange}
            options={studentService.getDegreeCollection()}
            error={errors.degree_id}
          />
          <Controls.DatePicker
            name="exam_date"
            label="Data examinării"
            value={values.exam_date}
            onChange={handleInputChange}
          />

          <Controls.RadioGroup
            name="frequency"
            label="Tip Invatamant"
            value={values.frequency}
            onChange={handleInputChange}
            items={studyTypes}
          />
        </Grid>
        <Grid item xs={6}>
          {/* <Controls.Checkbox
            name="termsAndConditions"
            label="Confirmare corectitudine datelor"
            value={values.termsAndConditions}
            onChange={handleInputChange}
          />
          <Controls.Checkbox
            name="termsAndConditions"
            label="Accept obligatiunile si drepturile conferite prin aceast act"
            value={values.termsAndConditions}
            onChange={handleInputChange}
          /> */}
          <div>
            <div>
              <label style={{ marginLeft: 10 }}>
                UNIVERSITATEA TRANSILVANIA DIN BRAȘOV{" "}
              </label>
            </div>
            <div>
              <text>
                Facultatea{" "}
                <input
                  type="text"
                  name="faculty"
                  value={values.faculty}
                  onChange={handleInputChange}
                  error={errors.faculty}
                  placeholder="...................................................................................."
                />
              </text>
            </div>
            <div>
              <label style={{ marginLeft: 10 }}>
                Cerere de alegere a temei de licență/diplomă/disertație și a
                conducătorului științific{" "}
              </label>
            </div>

            <text>
              Subsemnatul(a){" "}
              <input
                type="text"
                name="full_name"
                label="Nume Complet"
                value={values.full_name}
                onChange={handleInputChange}
                error={errors.full_name}
                placeholder="...................................................................................."
              />
              student(ă)/absolvent(ă) al(a) programului de studii{" "}
              <input
                name="study_program"
                value={values.study_program}
                onChange={handleInputChange}
                error={errors.study_program}
                placeholder="...................................................................................."
              />
              , grupa
              <input
                name="group"
                value={values.group}
                onChange={handleInputChange}
                error={errors.group}
                placeholder="...................................................................................."
              />
              , forma de învățământ
              <input
                name="frequency"
                type="text"
                value={values.frequency}
                onChange={handleInputChange}
                items={studyTypes}
              />{" "}
              doresc să realizez LUCRAREA DE LICENȚĂ/ PROIECTUL DE DIPLOMĂ/
              DISERTAȚIA cu tema:
              <input
                type="text"
                name="theme"
                value={values.theme}
                onChange={handleInputChange}
                error={errors.theme}
                placeholder="...................................................................................."
              />
            </text>
            <br />
          </div>
          <div>
            <text>
              Conducator științific al lucrării{" "}
              <input
                type="text"
                name="profesor"
                value={values.profesor}
                onChange={handleInputChange}
                error={errors.profesor}
                placeholder="...................................................................................."
              />
            </text>
          </div>
          <div>
            <text>BRAȘOV, </text>
            <div>
              <Controls.DatePicker
                name="dateAnexa2"
                label="Data"
                value={values.dateAnexa2}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <text>
                Student/Absolvent,{" "}
                <input
                  type="text"
                  name="full_name"
                  label="Full Name"
                  value={values.full_name}
                  onChange={handleInputChange}
                  error={errors.full_name}
                  placeholder="...................................................................................."
                />
                <label style={{ marginLeft: 10 }}>Semnătura</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 10,
                  }}
                >
                  <div style={{ border: "1px solid #c4c4c4" }}>
                    <SignatureCanvas
                      penColor="#000"
                      ref={refStudent}
                      canvasProps={{
                        width: 345,
                        height: 200,
                        className: "sigCanvas",
                      }}
                    />
                  </div>
                  {values.signiture && (
                    <a
                      href={values.signiture}
                      style={{ color: "#000" }}
                      download
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Preview
                    </a>
                  )}
                </div>
                <text>
                  Avizul conducătorului științific,{" "}
                  <div>
                    <Controls.DatePicker
                      name="date2Anexa2"
                      label="Data"
                      value={values.date2Anexa2}
                      onChange={handleInputChange}
                    />
                  </div>
                  <label style={{ marginLeft: 10 }}>Semnătura</label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 10,
                    }}
                  >
                    <div style={{ border: "1px solid #c4c4c4" }}>
                      <SignatureCanvas
                        penColor="#000"
                        ref={refProfesor}
                        canvasProps={{
                          width: 345,
                          height: 200,
                          className: "sigCanvas",
                        }}
                      />
                    </div>
                    {values.profesorSignuture && (
                      <a
                        href={values.profesorSignuture}
                        style={{ color: "#000" }}
                        download
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Preview
                      </a>
                    )}
                  </div>
                </text>
              </text>
            </div>
          </div>

          <div />
          <div>
            <label style={{ marginLeft: 10 }}>
              Cerere de alegere a temei lucrării și a conducătorului științific{" "}
              {props.progress.type === "anexa2" && (
                <span>(Uploading done {props.progress.precented}%)</span>
              )}
            </label>
            <br />
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                type="file"
                variant="outlined"
                name="anexa2"
                onChange={handleInputChange}
                error={errors.anexa2}
                helperText={errors.anexa2}
              />
              {values.anexa2 && (
                <a
                  href={values.anexa2}
                  style={{ color: "#000" }}
                  download
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Preview
                </a>
              )}
            </div>
          </div>

          <div>
            <div>
              <label style={{ marginLeft: 10 }}>
                Fisa lucrarii{" "}
                {props.progress.type === "anexa4" && (
                  <span>(Uploading done {props.progress.precented}%)</span>
                )}
              </label>
              <br />
              <div style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  type="file"
                  variant="outlined"
                  name="anexa4"
                  onChange={handleInputChange}
                  error={errors.anexa4}
                  helperText={errors.anexa4}
                />
                {values.anexa4 && (
                  <a
                    href={values.anexa4}
                    style={{ color: "#000" }}
                    download
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Preview
                  </a>
                )}
              </div>
            </div>
            <div>
              <div>
                <label style={{ marginLeft: 10 }}>
                  Cerere de inscriere la examen{" "}
                  {props.progress.type === "anexa6" && (
                    <span>(Uploading done {props.progress.precented}%)</span>
                  )}
                </label>
                <br />
                <div>
                  <TextField
                    type="file"
                    variant="outlined"
                    name="anexa6"
                    onChange={handleInputChange}
                    error={errors.anexa6}
                    helperText={errors.anexa6}
                  />
                  {values.anexa6 && (
                    <a
                      href={values.anexa6}
                      style={{ color: "#000" }}
                      download
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Preview
                    </a>
                  )}
                </div>
              </div>
              <div>
                <div>
                  <label style={{ marginLeft: 10 }}>
                    Informații prelucrare date cu caracter personal{" "}
                    {props.progress.type === "anexa7" && (
                      <span>(Uploading done {props.progress.precented}%)</span>
                    )}
                  </label>
                  <br />
                  <div>
                    <TextField
                      type="file"
                      variant="outlined"
                      name="anexa7"
                      onChange={handleInputChange}
                      error={errors.anexa7}
                      helperText={errors.anexa7}
                    />
                    {values.anexa7 && (
                      <a
                        href={values.anexa7}
                        style={{ color: "#000" }}
                        download
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Preview
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <label style={{ marginLeft: 10 }}>
                    Declarație privind originalitatea lucrării{" "}
                    {props.progress.type === "anexa8" && (
                      <span>(Uploading done {props.progress.precented}%)</span>
                    )}
                  </label>
                  <br />
                  <div>
                    <TextField
                      type="file"
                      variant="outlined"
                      name="anexa8"
                      onChange={handleInputChange}
                      error={errors.anexa8}
                      helperText={errors.anexa8}
                    />
                    {values.anexa8 && (
                      <a
                        href={values.anexa8}
                        style={{ color: "#000" }}
                        download
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Preview
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
        
          </div>
          <Controls.Checkbox
            name="checkboxObligatii"
            label="Am luat la cunoștință obligațiile și drepturile care îmi revin prin această înscriere."
            value={values.checkboxObligatii}
            onChange={handleInputChange}
            error={errors.checkboxObligatii}
          />
          
          
          <Controls.Checkbox
            name="checkboxCorectitudine"
            label="Confirm corectitudinea datelor introduse și sunt de acord cu prelucrarea acestora în toate scopurile ce derivă din procesul de înscriere."
            value={values.checkboxCorectitudine}
            onChange={handleInputChange}
            error={errors.checkboxCorectitudine}
          /> 
            <div style={{ marginTop: 15 }}>
              <Controls.Button type="submit" text="Submit" />
              <Controls.Button
                text="Reset"
                color="default"
                onClick={resetForm}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
