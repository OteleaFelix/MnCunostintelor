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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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
  { id: "full_name", label: "Nume Complet" },
  { id: "email", label: "Email  (Constitutional)" },
  { id: "city", label: "Oraș" },
  { id: "mobile", label: "Număr telefon" },
  { id: "degree", label: "Tipul de diplomă" },
  { id: "frequency", label: "Frecvența" },
  { id: "exam_date", label: "Ziua examinării" },
  { id: "study_program", label: "Program de studiu" },
  { id: "year_of_study", label: "Anul de studiu" },
  { id: "group", label: "Grupa" },
  { id: "faculty", label: "Facultate" },
  { id: "profesor", label: "Conducător Științific" },
  { id: "anexa2", label: "Anexa 2" },
  { id: "anexa4", label: "Anexa 4" },
  { id: "anexa6", label: "Anexa 6" },
  { id: "anexa7", label: "Anexa 7" },
  { id: "anexa8", label: "Anexa 8" },
  { id: "signiture", label: "Semnătura" },
  { id: "profesorSignuture", label: "Profesor Signiture" },
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
    async (student, resetForm, signiture, profesorSignuture) => {
      const user = JSON.parse(localStorage.getItem("user"));

      let files = [];

      typeof student.anexa2 === "object" &&
        files.push({ key: "anexa2", file: student.anexa2 });
      typeof student.anexa4 === "object" &&
        files.push({ key: "anexa4", file: student.anexa4 });
      typeof student.anexa6 === "object" &&
        files.push({ key: "anexa6", file: student.anexa6 });
      typeof student.anexa7 === "object" &&
        files.push({ key: "anexa7", file: student.anexa7 });
      typeof student.anexa8 === "object" &&
        files.push({ key: "anexa8", file: student.anexa8 });

      console.log({ files });
      let downloadURLPaths = [];
      if (!user) {
        alert("No user found.");
      }
      let promisees = [];
      if (files.length > 0) {
        files.map((file) =>
          promisees.push(upload(downloadURLPaths, user, file))
        );
      }
      Promise.all(promisees)
        .then(async (resp) => {
          console.log({ resp });
          setProgress(() => ({
            type: "",
            precented: 0,
          }));
          let parseStorageDocs;
          let a = {};
          let b = {};
          let c = {};
          let d = {};
          let e = {};
          if (resp.length > 0) {
            parseStorageDocs = resp.reduce((prev, cur) => {
              if (cur.name === "anexa2") {
                Object.assign(a, { anexa2: cur.path });
              }
              if (cur.name === "anexa4") {
                Object.assign(b, { anexa4: cur.path });
              }
              if (cur.name === "anexa6") {
                Object.assign(c, { anexa6: cur.path });
              }
              if (cur.name === "anexa7") {
                Object.assign(d, { anexa7: cur.path });
              }
              if (cur.name === "anexa8") {
                Object.assign(e, { anexa8: cur.path });
              }
              console.log("zzzz", { a, b, c, d, e });
              return { ...a, ...b, ...c, ...d, ...e };
              //   return { [cur.name]: cur.path };
            }, {});
          }
          console.log({ parseStorageDocs }, { ...a, ...b, ...c, ...d, ...e });
          if (!student.document_id) {
            // * Create
            await addDoc(collection(db, "documents"), {
              city: student.city,
              degree_id: student.degree_id,
              email: student.email,
              exam_date: student.exam_date.toLocaleDateString('ko-KR'),
              frequency: student.frequency,
              full_name: student.full_name,
              gender: student.gender,
              mobile: student.mobile,
              study_program: student.study_program,
              user_id: user.uid,
              year_of_study: student.year_of_study,
              group: student.group,
              faculty: student.faculty,
              profesor: student.profesor,
              ...(signiture && { signiture: signiture }),
              ...(profesorSignuture && {
                profesorSignuture: profesorSignuture,
              }),
              ...(parseStorageDocs ? parseStorageDocs : undefined),
            });
            alert("Documents saved.");
            getFireStoreDocuments(user);
            setOpenPopup(false);
          } else {
            const updateDocRef = doc(db, "documents", student.document_id);
            console.log({
              city: student.city,
              degree_id: student.degree_id,
              email: student.email,
              exam_date:
                typeof student.exam_date === "object"
                  ? student.exam_date.toLocaleDateString('ko-KR')
                  : student.exam_date,
              frequency: student.frequency,
              full_name: student.full_name,
              gender: student.gender,
              mobile: student.mobile,
              study_program: student.study_program,
              user_id: user.uid,
              year_of_study: student.year_of_study,
              group: student.group,
              faculty: student.faculty,
              profesor: student.profesor,
              ...(student.anexa2 ? { anexa2: student.anexa2 } : undefined),
              ...(student.anexa4 ? { anexa4: student.anexa4 } : undefined),
              ...(student.anexa6 ? { anexa6: student.anexa6 } : undefined),
              ...(student.anexa7 ? { anexa7: student.anexa7 } : undefined),
              ...(student.anexa8 ? { anexa8: student.anexa8 } : undefined),
              ...(signiture && { signiture: signiture }),
              ...(profesorSignuture && {
                profesorSignuture: profesorSignuture,
              }),
              ...(parseStorageDocs ? parseStorageDocs : undefined),
            });
            await updateDoc(updateDocRef, {
              city: student.city,
              degree_id: student.degree_id,
              email: student.email,
              exam_date:
                typeof student.exam_date === "object"
                  ? student.exam_date.toLocaleDateString('ko-KR')
                  : student.exam_date,
              frequency: student.frequency,
              full_name: student.full_name,
              gender: student.gender,
              mobile: student.mobile,
              study_program: student.study_program,
              user_id: user.uid,
              year_of_study: student.year_of_study,
              group: student.group ?? "",
              faculty: student.faculty ?? "",
              profesor: student.profesor ?? "",
              ...(student.anexa2 ? { anexa2: student.anexa2 } : undefined),
              ...(student.anexa4 ? { anexa4: student.anexa4 } : undefined),
              ...(student.anexa6 ? { anexa6: student.anexa6 } : undefined),
              ...(student.anexa7 ? { anexa7: student.anexa7 } : undefined),
              ...(student.anexa8 ? { anexa8: student.anexa8 } : undefined),
              ...(signiture && { signiture: signiture }),
              ...(profesorSignuture && {
                profesorSignuture: profesorSignuture,
              }),
              ...(parseStorageDocs ? parseStorageDocs : undefined),
            });
            alert("Documents updated.");
            getFireStoreDocuments(user);
            setOpenPopup(false);
          }
        })
        .catch((error) => {
          console.log({ error });
        });
    },
    [getFireStoreDocuments, upload]
  );

  // ** Download file in browser.
  //   const getImageFile = useCallback((path) => {
  //     const storage = getStorage();
  //     getDownloadURL(ref(storage, path))
  //       .then((url) => {
  //         // This can be downloaded directly:
  //         const xhr = new XMLHttpRequest();
  //         xhr.responseType = "blob";
  //         xhr.onload = (event) => {
  //           const blob = xhr.response;

  //           setRecordForEdit((prev) => ({ ...prev, anexa2: blob }));
  //           console.log({ blob });
  //         };
  //         xhr.open("GET", url);
  //         xhr.send();
  //       })
  //       .catch((error) => {
  //         console.log({ error });
  //       });
  //   }, []);

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
        title="Înscriere licență/disertație"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
        
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
                    {item.degree_id == 1
                      ? `Bachelor's degree (licență)`
                      : item.degree_id == 2
                      ? "Master degree (disertație)"
                      : "None"}
                  </TableCell>
                  <TableCell>{item.frequency}</TableCell>
                  <TableCell>{item.exam_date}</TableCell>
                  <TableCell>{item.study_program}</TableCell>
                  <TableCell>{item.year_of_study}</TableCell>
                  <TableCell>{item.group}</TableCell>
                  <TableCell>{item.faculty}</TableCell>
                  <TableCell>{item.profesor}</TableCell>
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
                    {item.signiture && (
                      <a
                        href={item.signiture}
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
                    {item.profesorSignuture && (
                      <a
                        href={item.profesorSignuture}
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
        title="Înscriere"
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




