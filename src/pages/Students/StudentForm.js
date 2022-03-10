import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { Fab } from "@material-ui/core";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import PageHeader from "../../components/PageHeader";
import Controls from "../../components/controls/Controls";
import { Typography } from "@material-ui/core";
import UploadFiles from "../../components/upload-files.component";
import { useForm, Form } from "../../components/useForm";
import * as studentService from "../../services/studentService";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";

const genderItems = [
  { id: "male", title: "Male" },
  { id: "female", title: "Female" },
  { id: "other", title: "Other" },
];

const studyTypes = [
  { id: "IFR", title: "IFR" },
  { id: "ID", title: "ID" },
  { id: "IF", title: "IF" },
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
  frequency: false,
};



export default function StudentForm(props) {
  const { addOrEdit, recordForEdit } = props;
 const [progress, setProgress] = useState(0);
const formHandler = (e) => {
  e.preventDefault();
  const file = e.target[0].files[0];
  uploadFiles(file);
};

const uploadFiles = (file) => {
  //
  if (!file) return;
  const sotrageRef = ref(storage, `files/${file.name}`);
  const uploadTask = uploadBytesResumable(sotrageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const prog = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      setProgress(prog);
    },
    (error) => console.log(error),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
      });
    }
  );
};

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("full_name" in fieldValues)
      temp.full_name = fieldValues.full_name ? "" : "This field is required.";
    if ("email" in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email)
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
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addOrEdit(values, resetForm);
    }
  };

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);

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
        </Grid>
        <Grid item xs={6}>
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
          {/* <Controls.Checkbox
            name="isInvatamantDistanta"
            label="ID:"
            value={values.isInvatamantDistantaE}
            onChange={handleInputChange}
          /> */}
           <div>
      <form onSubmit={formHandler}>
        <input type="file" className="input" />
            <Controls.Button type="submit" text="Upload" />
      </form>
      <hr />
      <h2>Uploading done {progress}%</h2>
    </div>
    <div>
      <form onSubmit={formHandler}>
        <input type="file" className="input" />
        <Controls.Button type="submit" text="Upload" />
      </form>
      <hr />
      <h2>Uploading done {progress}%</h2>
    </div>
    <div>
      <form onSubmit={formHandler}>
        <input type="file" className="input" />
        <Controls.Button type="submit" text="Upload" />
      </form>
      <hr />
      <h2>Uploading done {progress}%</h2>
    </div>
    <div>
      <form onSubmit={formHandler}>
        <input type="file" className="input" />
        <Controls.Button type="submit" text="Upload" />
      </form>
      <hr />
      <h2>Uploading done {progress}%</h2>
    </div>
    <div>
      <form onSubmit={formHandler}>
        <input type="file" className="input" />
        <Controls.Button type="submit" text="Upload" />
      </form>
      <hr />
      <h2>Uploading done {progress}%</h2>
    </div>
    
          <div>
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
