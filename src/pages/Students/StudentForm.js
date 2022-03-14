/* eslint-disable eqeqeq */
import React, { useRef, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import SignatureCanvas from "react-signature-canvas";
import { useForm, Form } from "../../components/useForm";
import * as studentService from "../../services/studentService";
import { TextField } from "@material-ui/core";

const genderItems = [
  { id: "male", title: "Male" },
  { id: "female", title: "Female" },
  { id: "other", title: "Other" }
];

const studyTypes = [
  { id: "IFR", title: "IFR" },
  { id: "ID", title: "ID" },
  { id: "IF", title: "IF" }
  
];

const facultyTypes = [
 {id:"de Design de produs și mediu",title:"Facultatea de Design de produs și mediu"},
 {id:"de Inginerie electrică și știința calculatoarelor",title:"Facultatea de Inginerie electrică și știința calculatoarelor"},
 {id:"de Design de mobilier și inginerie a lemnului",title:"Facultatea de Design de mobilier și inginerie a lemnului"},
 {id:"de Inginerie mecanică",title:"Facultatea de Inginerie mecanică"},
 {id:"de Inginerie tehnologică și management industrial",title:"Facultatea de Inginerie tehnologică și management industrial"},
 {id:"de Silvicultură și exploatări forestiere",title:" Facultatea de Silvicultură și exploatări forestiere"},
 {id:"de Știinta și ingineria materialelor",title:" Facultatea de Știinta și ingineria materialelor"},
 {id:"de Drept",title:" Facultatea de Drept"},
 {id:"de Educație fizică și sporturi montane",title:" Facultatea de Educație fizică și sporturi montane"},
 {id:"de Litere",title:" Facultatea de Litere"},
 {id:"de Matematică și informatică",title:" Facultatea de Matematică și informatică"},
 {id:"de Medicină",title:" Facultatea de Medicină"},
 {id:"de Muzică",title:" Facultatea de Muzică"},
 {id:"de Psihologie și științele educației",title:" Facultatea de Psihologie și științele educației"},
 {id:"de Sociologie și comunicare",title:" Facultatea de Sociologie și comunicare"},
 {id:"de Științe economice și administrarea afacerilor",title:" Facultatea de Științe economice și administrarea afacerilor"},
 {id:"de Alimentație și turism",title:"Facultatea de Alimentație și turism"},
 {id:"de Construcții",title:"Facultatea de Construcții"}
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
  exam_date: new Date(),
  frequency: "",
  anexa2: undefined,
  anexa4: undefined,
  anexa6: undefined,
  anexa7: undefined,
  anexa8: undefined,
  signuture: undefined,
  group:"",
  faculty:"",
  theme:"",
  profesor:"",
  dateAnexa2: new Date(),
  date2Anexa2:new Date(),
  profesorSignuture:undefined
};

export default function StudentForm(props) {
  const { addOrEdit, recordForEdit } = props;
  const ref = useRef();

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("full_name" in fieldValues)
      temp.full_name = fieldValues.full_name ? "" : "This field is required.";
    if ("email" in fieldValues)
      temp.email = /$^|.+@student.unitbv.ro/.test(fieldValues.email)
        ? ""
        : "Email is not valid.";
    if ("mobile" in fieldValues)
      temp.mobile =
        fieldValues.mobile.length > 9 ? "" : "Minimum 10 numbers required.";
    if ("degreeId" in fieldValues)
      temp.degreeId =
        fieldValues.degreeId.length != 0 ? "" : "This field is required.";
    if ("study_program" in fieldValues)
      temp.study_program = fieldValues.study_program
        ? ""
        : "This field is required.";
    if ("year_of_study" in fieldValues)
      temp.year_of_study =
        fieldValues.year_of_study < 7
          ? ""
          : "Interval of numbers  should be from 1 to 6";
    // if ("anexa2" in fieldValues) {
    //   temp.anexa2 = fieldValues.anexa2 ? "" : "This field is required.";
    // }
    setErrors({
      ...temp
    });

    if (fieldValues == values) return Object.values(temp).every(x => x == "");
  };

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialFValues, true, validate);

  const handleSubmit = e => {
    e.preventDefault();
    let signiture = ref.current.getTrimmedCanvas().toDataURL("image/png");

    if (validate()) {
      console.log({ values });
      addOrEdit(values, resetForm, !ref.current.isEmpty() && signiture);
    }
  };

  useEffect(
    () => {
      if (recordForEdit != null)
        setValues({
          ...recordForEdit
        });
    },
    [recordForEdit, setValues]
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            name="full_name"
            label="Full Name"
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
            label="Study Program"
            value={values.study_program}
            onChange={handleInputChange}
            error={errors.study_program}
          />
           <Controls.Input
            name="group"
            label="Group"
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
            label="Year Of Study"
            name="year_of_study"
            value={values.year_of_study}
            onChange={handleInputChange}
            error={errors.year_of_study}
          />

          <Controls.Input
            label="Mobile"
            name="mobile"
            value={values.mobile}
            onChange={handleInputChange}
            error={errors.mobile}
          />
          <Controls.Input
            label="City"
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
            label="Gender"
            value={values.gender}
            onChange={handleInputChange}
            items={genderItems}
          />
          <Controls.Select
            name="degree_id"
            label="Degree type"
            value={values.degree_id}
            onChange={handleInputChange}
            options={studentService.getDegreeCollection()}
            error={errors.degree_id}
          />
          <Controls.DatePicker
            name="exam_date"
            label="exam Date"
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
              UNIVERSITATEA TRANSILVANIA DIN BRAȘOV  {" "}
            </label>
            </div>
            <div>
            <text>
                Facultatea {" "}
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
                  label="Full Name"
                  value={values.full_name}
                  onChange={handleInputChange}
                  error={errors.full_name}
                  placeholder="...................................................................................."
                />
                 student(ă)/absolvent(ă) al(a) programului de studii <input
                  name="study_program"
                  value={values.study_program}
                  onChange={handleInputChange}
                  error={errors.study_program}
                  placeholder="...................................................................................."
                /> 
                , grupa<input
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
              /> doresc să realizez LUCRAREA DE LICENȚĂ/ PROIECTUL DE DIPLOMĂ/ DISERTAȚIA cu tema:
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
              Conducator științific al lucrării <input
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
            <text>
              BRAȘOV, </text>
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
              Student/Absolvent,  <input
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
                  marginLeft: 10
                }}
              >
                <div style={{ border: "1px solid #c4c4c4" }}>
                  <SignatureCanvas
                    penColor="#000"
                    ref={ref}
                    canvasProps={{
                      width: 345,
                      height: 200,
                      className: "sigCanvas"
                    }}
                  />
                </div>
                {values.signiture &&
                  <a
                    href={values.signiture}
                    style={{ color: "#000" }}
                    download
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Preview
                  </a>}

               
              </div>
              <text>
              Avizul conducătorului științific,  <div>
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
                  marginLeft: 10
                }}
              >
                <div style={{ border: "1px solid #c4c4c4" }}>
                  <SignatureCanvas
                    penColor="#000"
                    ref={ref}
                    canvasProps={{
                      width: 345,
                      height: 200,
                      className: "sigCanvas"
                    }}
                  />
                </div>
                {values.profesorSigniture &&
                  <a
                    href={values.profesorSigniture}
                    style={{ color: "#000" }}
                    download
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Preview
                  </a>}

               
              </div> 
                </text>
              </text>
              
            </div>
            
            </div>
            
          <div />
          <div>
            <label style={{ marginLeft: 10 }}>
              Cerere de alegere a temei lucrarii si a conducatorului stiintific{" "}
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
                  Download
                </a>
              )}
            </div>
          </div>
          
          <div>
            <div>
              <label style={{ marginLeft: 10 }}>
                Fisa lucrarii{" "}
                {props.progress.type === "anexa4" &&
                  <span>
                    (Uploading done {props.progress.precented}%)
                  </span>}
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
                {values.anexa4 &&
                  <a
                    href={values.anexa4}
                    style={{ color: "#000" }}
                    download
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Preview
                  </a>}
              </div>
            </div>
            <div>
              <div>
                <label style={{ marginLeft: 10 }}>
                  Cerere de inscriere la examen{" "}
                  {props.progress.type === "anexa6" &&
                    <span>
                      (Uploading done {props.progress.precented}%)
                    </span>}
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
                  {values.anexa6 &&
                    <a
                      href={values.anexa6}
                      style={{ color: "#000" }}
                      download
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Preview
                    </a>}
                </div>
              </div>
              <div>
                <div>
                  <label style={{ marginLeft: 10 }}>
                    Informatii prelucrare date cu caracter personal{" "}
                    {props.progress.type === "anexa7" &&
                      <span>
                        (Uploading done {props.progress.precented}%)
                      </span>}
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
                    {values.anexa7 &&
                      <a
                        href={values.anexa7}
                        style={{ color: "#000" }}
                        download
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Preview
                      </a>}
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <label style={{ marginLeft: 10 }}>
                    Declaratie privind originalitatea lucrarii{" "}
                    {props.progress.type === "anexa8" &&
                      <span>
                        (Uploading done {props.progress.precented}%)
                      </span>}
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
                    {values.anexa8 &&
                      <a
                        href={values.anexa8}
                        style={{ color: "#000" }}
                        download
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Preview
                      </a>}
                  </div>
                </div>
              </div>
           
            </div>
            
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
