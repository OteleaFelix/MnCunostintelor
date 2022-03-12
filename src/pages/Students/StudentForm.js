import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { Fab } from "@material-ui/core";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import PageHeader from "../../components/PageHeader";
import { Input, InputLabel } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { Typography } from "@material-ui/core";
import UploadFiles from "../../components/upload-files.component";
import { useForm, Form } from "../../components/useForm";
import * as studentService from "../../services/studentService";
import { TextField } from "@material-ui/core";

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
  anexa2: undefined,
  anexa4: undefined,
  anexa6: undefined,
  anexa7: undefined,
  anexa8: undefined,
};

export default function StudentForm(props) {
  const { addOrEdit, recordForEdit } = props;

  //   const formHandler = (e) => {
  //     e.preventDefault();
  //     const file = e.target[0].files[0];
  //     uploadFiles(file);
  //   };

  //   const uploadFiles = (file) => {

  //   };

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
    if (validate()) {
      addOrEdit(values, resetForm);
    }
  };

  console.log({ values });

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
            <label style={{ marginLeft: 10 }}>
              Cerere de alegere a temei lucrarii si a conducatorului stiintific{" "}
              {props.progress.type === "anexa2" && (
                <span>(Uploading done {props.progress.precented}%)</span>
              )}
            </label>
            <br />
            <TextField
              type="file"
              variant="outlined"
              name="anexa2"
              onChange={handleInputChange}
              error={errors.anexa2}
              helperText={errors.anexa2}
            />
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
              <TextField
                type="file"
                variant="outlined"
                name="anexa4"
                onChange={handleInputChange}
                error={errors.anexa4}
                helperText={errors.anexa4}
              />
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
                <TextField
                  type="file"
                  variant="outlined"
                  name="anexa6"
                  onChange={handleInputChange}
                  error={errors.anexa6}
                  helperText={errors.anexa6}
                />
              </div>
              <div>
                <div>
                  <label style={{ marginLeft: 10 }}>
                    Informatii prelucrare date cu caracter personal{" "}
                    {props.progress.type === "anexa7" && (
                      <span>(Uploading done {props.progress.precented}%)</span>
                    )}
                  </label>
                  <br />
                  <TextField
                    type="file"
                    variant="outlined"
                    name="anexa7"
                    onChange={handleInputChange}
                    error={errors.anexa7}
                    helperText={errors.anexa7}
                  />
                </div>
              </div>
              <div>
                <div>
                  <label style={{ marginLeft: 10 }}>
                    Declaratie privind originalitatea lucrarii{" "}
                    {props.progress.type === "anexa8" && (
                      <span>(Uploading done {props.progress.precented}%)</span>
                    )}
                  </label>
                  <br />
                  <TextField
                    type="file"
                    variant="outlined"
                    name="anexa8"
                    onChange={handleInputChange}
                    error={errors.anexa8}
                    helperText={errors.anexa8}
                  />
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
