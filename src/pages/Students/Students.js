/* eslint-disable eqeqeq */
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
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import useTable from "../../components/useTable";
// import * as studentService from "../../services/studentService";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../components/Popup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";

import { db, storage } from "../../firebase";
import { useHistory } from "react-router-dom";

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
  const history = useHistory();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [records, setRecords] = useState([]);
  const [progress, setProgress] = useState({ type: "", precented: 0 });
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
    const getAuthUserQuery = query(
      collection(db, "users"),
      where("uid", "==", user.uid)
    );
    const authUser = await getDocs(getAuthUserQuery);
    let userRole = "";
    if (authUser.docs.length > 0) {
      authUser.forEach((user) => (userRole = user.data().role));
    }

    let userDocumentsQ;
    if (userRole !== "admin") {
      userDocumentsQ = query(
        collection(db, "documents"),
        where("user_id", "==", user.uid)
      );
    } else {
      userDocumentsQ = query(collection(db, "documents"));
    }

    const documentes = await getDocs(userDocumentsQ);
    if (documentes.docs.length > 0) {
      let results = [];
      documentes.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        results.push({ document_id: doc.id, user_id: user.uid, ...doc.data() });
      });

      setRecords(results);
    }
    const storage = getStorage();
    getDownloadURL(ref(storage, "documents/7WHeFag9hsNRNSk1lwSSBAzeUlv2/2.png"))
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          const blob = xhr.response;

          console.log({ blob });
        };
        xhr.open("GET", url);
        xhr.send();
      })
      .catch((error) => {
        console.log({ error });
      });
  }, []);

  const upload = useCallback((downloadURLPaths, user, files) => {
    return new Promise((resolve, reject) => {
      const sotrageRef = ref(
        storage,
        `documents/${user.uid}/${files.file[0].name}`
      );
      const uploadTask = uploadBytesResumable(sotrageRef, files.file[0]);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(() => ({
            type: files.key,
            precented: prog,
          }));
        },
        (error) => {
          console.log(error);
          reject(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve({ name: files.key, path: downloadURL });
            // downloadURLPaths.push({ name: files.key, path: downloadURL });
            console.log("File available at", downloadURL);
          });
        }
      );
    });
  }, []);

  const addOrEdit = useCallback(
    async (student, resetForm) => {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("xxx", student);
      const files = [
        student.anexa2 ? { key: "anexa2", file: student.anexa2 } : undefined,
        student.anexa4 ? { key: "anexa4", file: student.anexa4 } : undefined,
        student.anexa6 ? { key: "anexa6", file: student.anexa6 } : undefined,
        student.anexa7 ? { key: "anexa7", file: student.anexa7 } : undefined,
        student.anexa8 ? { key: "anexa8", file: student.anexa8 } : undefined,
      ];
      let downloadURLPaths = [];
      if (!user) {
        alert("No user found.");
      }
      let promisees = [];
      files.map((file) => promisees.push(upload(downloadURLPaths, user, file)));
      Promise.all(promisees)
        .then(async (resp) => {
          console.log({ resp });
          setProgress(() => ({
            type: "",
            precented: 0,
          }));
          const parseStorageDocs = resp.reduce((prev, cur) => {
            return { [prev.name]: prev.path, [cur.name]: cur.path };
          });
          if (!student.document_id) {
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
              ...parseStorageDocs,
            });
            alert("Documents saved");
          } else {
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
        })
        .catch((error) => {
          console.log({ error });
        });

      getFireStoreDocuments(user);

      // if (student.id == 0) studentService.insertStudent(student);
      // else studentService.updateStudent(student);
      //   resetForm();
      //   setRecordForEdit(null);
      //   setOpenPopup(false);
      // setRecords(studentService.getAllStudents());
    },
    [getFireStoreDocuments, upload]
  );

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const deleteDocument = useCallback(
    async (item) => {
      console.log({ item });
      await deleteDoc(doc(db, "documents", item.document_id));
      const user = JSON.parse(localStorage.getItem("user"));
      getFireStoreDocuments(user);
    },
    [getFireStoreDocuments]
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      history.push("/login");
    } else {
      getFireStoreDocuments(user);
    }
  }, [getFireStoreDocuments, history]);

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
                  <TableCell>
                    {item.anexa2 && (
                      <a
                        href={item.anexa2}
                        style={{ color: "#000" }}
                        download
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Download
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.anexa4 && (
                      <a
                        href={item.anexa4}
                        style={{ color: "#000" }}
                        download
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Download
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.anexa6 && (
                      <a
                        href={item.anexa6}
                        style={{ color: "#000" }}
                        download
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Download
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.anexa7 && (
                      <a
                        href={item.anexa7}
                        style={{ color: "#000" }}
                        download
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Download
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.anexa8 && (
                      <a
                        href={item.anexa8}
                        style={{ color: "#000" }}
                        download
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Download
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => {
                        openInPopup(item);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </Controls.ActionButton>
                    <Controls.ActionButton
                      color="secondary"
                      onClick={() => deleteDocument(item)}
                    >
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
        <StudentForm
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit}
          progress={progress}
        />
      </Popup>
    </>
  );
}
