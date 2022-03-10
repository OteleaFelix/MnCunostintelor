import React, { useCallback, useEffect, useState } from "react";
import StudentForm from "./StudentForm";
import PageHeader from "../../components/PageHeader";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import {
  query,
  getDocs,
  collection,
  where,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import useTable from "../../components/useTable";
import * as studentService from "../../services/studentService";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../components/Popup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import { db, firebaseApp } from "../../firebase";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
    overflow: "auto",
    maxHeight: 650,
  },
  searchInput: {
    // width: "75%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
}));

const headCells = [
  { id: "full_name", label: "Student Name" },
  { id: "email", label: "Email Address (Personal)" },
  { id: "city", label: "City" },
  { id: "mobile", label: "Mobile Number" },
  { id: "degree", label: "Degree Type" },
  { id: "frequency", label: "Frequency" },
  { id: "exam_date", label: "Exam Date" },
  { id: "study_program", label: "Study Program" },
  { id: "year_of_study", label: "Year Of Study" },
  { id: "anexa2", label: "Anexa 2" },
  { id: "anexa4", label: "Anexa 4" },
  { id: "anexa6", label: "Anexa 6" },
  { id: "anexa7", label: "Anexa 7" },
  { id: "anexa8", label: "Anexa 8" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function Students() {
  const classes = useStyles();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [records, setRecords] = useState([]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [openPopup, setOpenPopup] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.fullName.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const getFireStoreDocuments = useCallback(async (user) => {
    const userDocumentsQ = query(
      collection(db, "documents"),
      where("user_id", "==", user.uid)
    );
    console.log(user);
    const documentes = await getDocs(userDocumentsQ);
    if (documentes.docs.length > 0) {
      let results = [];
      documentes.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        results.push({ document_id: doc.id, user_id: user.uid, ...doc.data() });
      });
      console.log(results);
      setRecords(results);
    }
  }, []);

  const addOrEdit = useCallback(
    async (student, resetForm) => {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(student);

      if (!user) {
        alert("No user found.");
      }
      if (!student.document_id) {
        const storage = getStorage();

        const storageRef = firebaseApp.storage().ref();
        const fileRef = storageRef.child(student.file[0].name);
        await fileRef.put(student.file[0]);
        const fileUrl = await fileRef.getDownloadURL();
        console.log(fileUrl);

        // Create the file metadata
        /** @type {any} */
        // const metadata = {
        //   contentType: "image/jpeg",
        // };
        // // Upload file and metadata to the object 'images/mountains.jpg'
        // const storageRef = ref(storage, "documents/" + student.file[0].name);
        // const uploadTask = uploadBytesResumable(
        //   storageRef,
        //   student.file[0],
        //   metadata
        // );
        // // Listen for state changes, errors, and completion of the upload.
        // uploadTask.on(
        //   "state_changed",
        //   (snapshot) => {
        //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        //     const progress =
        //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     console.log("Upload is " + progress + "% done");
        //     switch (snapshot.state) {
        //       case "paused":
        //         console.log("Upload is paused");
        //         break;
        //       case "running":
        //         console.log("Upload is running");
        //         break;
        //     }
        //   },
        //   (error) => {
        //     // A full list of error codes is available at
        //     // https://firebase.google.com/docs/storage/web/handle-errors
        //     switch (error.code) {
        //       case "storage/unauthorized":
        //         // User doesn't have permission to access the object
        //         break;
        //       case "storage/canceled":
        //         // User canceled the upload
        //         break;
        //       // ...
        //       case "storage/unknown":
        //         // Unknown error occurred, inspect error.serverResponse
        //         break;
        //     }
        //   },
        //   () => {
        //     // Upload completed successfully, now we can get the download URL
        //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //       console.log("File available at", downloadURL);
        //     });
        //   }
        // );

        // * Create
        await addDoc(collection(db, "documents"), {
          city: student.city,
          degree_id: student.degree_id,
          email: student.email,
          exam_date: student.exam_date.toLocaleDateString("en-GB"),
          frequency: student.frequency,
          full_name: student.full_name,
          gender: student.gender,
          mobile: student.mobile,
          study_program: student.study_program,
          user_id: user.uid,
          year_of_study: student.year_of_study,
        });
      } else {
        console.log("jere");
        const updateDocRef = doc(db, "documents", student.document_id);
        await updateDoc(updateDocRef, {
          city: student.city,
          degree_id: student.degree_id,
          email: student.email,
          exam_date:
            typeof student.exam_date === "object"
              ? student.exam_date.toLocaleDateString("en-GB")
              : student.exam_date,
          frequency: student.frequency,
          full_name: student.full_name,
          gender: student.gender,
          mobile: student.mobile,
          study_program: student.study_program,
          user_id: user.uid,
          year_of_study: student.year_of_study,
        });
      }
      getFireStoreDocuments(user);

      // if (student.id == 0) studentService.insertStudent(student);
      // else studentService.updateStudent(student);
      //   resetForm();
      //   setRecordForEdit(null);
      //   setOpenPopup(false);
      // setRecords(studentService.getAllStudents());
    },
    [getFireStoreDocuments]
  );

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    getFireStoreDocuments(user);
  }, [getFireStoreDocuments]);

  return (
    <>
      <PageHeader
        title="Bachelor's degree/Master Degree registration"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search Student"
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
          />
          <Controls.Button
            text="Add New"
            variant="outlined"
            startIcon={<AddIcon />}
            className={classes.newButton}
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
            }}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map((item) => {
              return (
                <TableRow key={`table-${item.user_id}`}>
                  <TableCell>{item.full_name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.city}</TableCell>
                  <TableCell>{item.mobile}</TableCell>
                  <TableCell>
                    {item.degree_id === 1
                      ? `Bachelor's degree (licență)`
                      : item.degree_id === 2
                      ? "Master degree (disertație)"
                      : "None"}
                  </TableCell>
                  <TableCell>{item.frequency}</TableCell>
                  <TableCell>{item.exam_date}</TableCell>
                  <TableCell>{item.study_program}</TableCell>
                  <TableCell>{item.year_of_study}</TableCell>
                  <TableCell>{item.anexa2}</TableCell>
                  <TableCell>{item.anexa4}</TableCell>
                  <TableCell>{item.anexa6}</TableCell>
                  <TableCell>{item.anexa7}</TableCell>
                  <TableCell>{item.anexa8}</TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => {
                        openInPopup(item);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </Controls.ActionButton>
                    <Controls.ActionButton color="secondary">
                      <CloseIcon fontSize="small" />
                    </Controls.ActionButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup
        title="Student Form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <StudentForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
    </>
  );
}
