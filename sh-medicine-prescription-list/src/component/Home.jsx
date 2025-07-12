import { useState, useEffect } from "react";
import { searchPatients } from "../utils/ApiFunctions";
import { getPatientById } from "../utils/ApiFunctions";
import {
  getAllDocumentsByPatientId,
  getAllInpatients,
} from "../utils/ApiFunctions";
import { deleteDocumentById } from "../utils/ApiFunctions";
import { Link, useParams } from "react-router-dom";
import { isEmpty } from "../utils/Functions";
import { formatDate } from "../utils/Functions";
import { formatDate2 } from "../utils/Functions";
import { formatDateToISO } from "../utils/Functions";
import { isoToTimestampSeconds } from "../utils/Functions";
import { isLessThanOneHour } from "../utils/Functions";
import ListDetails from "./MedicineList/ListDetails";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ApproveModal from "./MedicineList/ApproveModal";

export default function Home() {
  const [presentation, setPresentation] = useState(1);

  const { id } = useParams();
  const [patientStateId, setPatientStateId] = useState(id);
  const ROLE = localStorage.getItem("businessRole");

  const [showApproveModal, setShowApproveModal] = useState(false);

  const [documentsList, setDocumentsLList] = useState([
    {
      medicineListID: null,
      patientRef: null,
      documentName: "",
      medicineListCreationUser: "",
      medicineListCreationDate: null,
      medicineDetails: [],
    },
  ]);

  const [patientName, setPatientName] = useState("");
  const [searchedPatients, setSearchedPatients] = useState([
    { id: "", name: "" },
  ]);

  const [patient, setPatient] = useState({
    id: "",
    name: "",
    historyNumber: "",
    address: "",
    phone: "",
    department: "",
    roomNumber: "",
    bedNumber: "",
    gender: "",
    age: "",
    birthDate: "",
    doctor: "",
  });

  const [patients, setPatients] = useState([]);
  const [localSearchedPatients, setLocalSearchedPatients] = useState([]);
  const [patientsDocuments, setPatientsDocuments] = useState([]);

  /*useEffect(() => {
    patients.map(patient=>getAllDocumentsByPatientId(patient.id).then((documents) => {
      if(documents.length>0) return setPatientsDocuments(prevValue=>[...prevValue, documents] );
    }))
    ;
  }, [patients]);
  console.log(patientsDocuments);*/
  const [residence, setResidence] = useState(
    localStorage.getItem("residence") ? localStorage.getItem("residence") : "19"
  );

  function handleResidenceClick(residence) {
    localStorage.setItem("residence", residence);
    setResidence(residence);
  }

  useEffect(() => {
    if (residence === "19" || residence === "37")
      getAllInpatients(true, residence).then((patients) => {
        return setPatients(patients);
      });
  }, [residence]);

  const [selectDocument, setSelectDocument] = useState("1|1");
  const [selectedDocument, setSelectedDocument] = useState([]);

  function handleSelectDocument(link, selectedIndex) {
    setSelectDocument(link);
    localStorage.setItem("selectedIndex", selectedIndex);
    const newSelectedDocumentArr = Array(selectedDocument.length).fill(false);
    newSelectedDocumentArr[selectedIndex] = true;
    setSelectedDocument(newSelectedDocumentArr);
  }

  useEffect(() => {
    if (id && patientStateId) {
      getPatientById(patientStateId).then((patient) => {
        setPatientStateId(null);
        return setPatient(patient);
      });
    }
  }, [patient.id]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!patient.id) return;

      try {
        const data = await getAllDocumentsByPatientId(patient.id);
        setDocumentsLList(data);
        setSelectedDocument(Array(data.length).fill(false));
        handleSelectDocument(
          data[0].medicineListID + "|" + data[0].patientRef,
          0
        );
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [patient.id]);

  const handleSearchPatientsInputChange = (event) => {
    const value = event.target.value;

    setPatientName(event.target.value);
    if (!isEmpty(value)) {
      searchPatients(value.trim()).then((searchedPatients) => {
        setSearchedPatients((prevValues) => {
          return [...searchedPatients];
        });
      });
    } else {
      setSearchedPatients([{ id: 0, name: "" }]);
    }
  };

  const handleLocalSearchPatientsInputChange = (event) => {
    const value = event.target.value;

    setPatientName(event.target.value);
    if (!isEmpty(value)) {
      seachLocalPatients(value);
    }
  };

  const seachLocalPatients = (value) => {
    const filteredPatients = patients.filter((patient) =>
      patient.name.toLowerCase().includes(value.toLowerCase())
    );
    setLocalSearchedPatients(filteredPatients);
  };

  async function handleSearchedPatientClick(event) {
    setShowSuggestions(false);
    const patientId = event.currentTarget.dataset.patientid;
    const data = await getPatientById(patientId);
    setPatient(data);
  }

  async function handleDeleteDocument() {
    await deleteDocumentById(selectDocument.split("|")[0]);
    const data = await getAllDocumentsByPatientId(patient.id);

    setDocumentsLList(data);

    handleSelectDocument(
      documentsList[localStorage.getItem("selectedIndex") - 1].medicineListID +
        "|" +
        documentsList[localStorage.getItem("selectedIndex") - 1].patientRef,
      localStorage.getItem("selectedIndex")
    );

    const newSelectedDocumentArr = Array(data.length).fill(false);
    newSelectedDocumentArr[localStorage.getItem("selectedIndex") - 1] = true;
    setSelectedDocument(newSelectedDocumentArr);
  }

  function handleSetPresentation(event) {
    const selectedValue = event.target.value;
    if (selectedValue === "presentation1") {
      setPresentation(1);
    } else if (selectedValue === "presentation2") {
      setPresentation(2);
    }
  }

  const [order, setOrder] = useState(false);

  function handlePatientsSort() {
    getAllInpatients(order, residence).then((patients) => {
      return setPatients(patients);
    });
    setOrder((prevValue) => !prevValue);
  }

  const highLightIds = useMemo(() => {
    const ids = [];

    patients.forEach((p) => {
      p.medicineListEditDates?.forEach((mled) => {
        try {
          if (
            isLessThanOneHour(
              isoToTimestampSeconds(formatDate2(mled).toISOString())
            )
          ) {
            ids.push(p.id);
          }
        } catch (error) {
          console.log(error);
        }
      });
    });

    return ids;
  }, [patients]);

  const presentationA = (
    <>
      <label>
        <input
          className="radio-input"
          type="radio"
          style={{ marginLeft: "10px", visibility: "hidden" }}
          name="presentation"
          value="presentation1"
          onChange={handleSetPresentation}
        />
        <span
          className={`venue ${residence === "19" && "underline"}`}
          onClick={() => handleResidenceClick("19")}
        >
          Реконструктивна хірургія{" "}
        </span>
        <span
          className={`venue ${residence === "37" && "underline"}`}
          onClick={() => handleResidenceClick("37")}
        >
          Реабілітація
        </span>
      </label>
      {/*<label>
        <input
          className="radio-input"
          type="radio"
          style={{ marginLeft: "10px", visibility: "hidden" }}
          name="presentation"
          value="presentation2"
          onChange={handleSetPresentation}
        />
        <span className="venue" onClick={() => handleResidenceClick("Усі")}>
          Усі
        </span>
      </label>*/}
      <div>
        <div>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Листок медичних призначень</title>
          <style>{`
body {
  font-family: Arial, sans-serif;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ccc;
  padding: 6px;
  text-align: left;
}

th {
  background-color: #e0f0ff;
}

tr:nth-child(even) {
  background-color: #ccffcc;
}

tr:nth-child(odd) {
  /*background-color: #e6ecff;*/
  background-color: #ccffcc;
}

.header {
  background-color: #b0d0ff;
}

.highlight {
  background-color: #ccffcc !important;
  font-weight: bold;
}
`}</style>
          {presentation === 2 && (
            <div className="sidebar">
              <div className="search-container">
                <div>
                  <input
                    type="text"
                    placeholder="Пошук..."
                    id="search"
                    className="search-input"
                    name="search"
                    value={patientName}
                    onChange={handleSearchPatientsInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    autoComplete="off"
                  />
                  {!isEmpty(patientName) && showSuggestions && (
                    <div className="searched-patients-dropdown">
                      {searchedPatients.map((patient, i) => (
                        <a
                          onClick={handleSearchedPatientClick}
                          data-patientid={patient.id}
                          href="#"
                          key={i}
                        >
                          {patient.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div
            className="content"
            style={presentation === 1 ? { marginLeft: "0" } : {}}
          >
            <h2>Список пацієнтів</h2>
            <div className="search-container">
              <div>
                <input
                  type="text"
                  placeholder="Пошук..."
                  id="search"
                  className="local-patients-search-input"
                  name="search"
                  value={patientName}
                  onChange={handleLocalSearchPatientsInputChange}
                  autoComplete="off"
                />
                {!isEmpty(patientName) && showSuggestions && (
                  <div className="searched-patients-dropdown">
                    {searchedPatients.map((patient, i) => (
                      <a
                        onClick={handleSearchedPatientClick}
                        data-patientid={patient.id}
                        href="#"
                        key={i}
                      >
                        {patient.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <table>
              <thead>
                <tr className="header">
                  <th>Номер</th>
                  <th onClick={handlePatientsSort} className="patient-sort">
                    Пацієнт
                  </th>
                  <th>Палата</th>
                  <th>Ліжко</th>
                  <th>Лікар</th>
                </tr>
              </thead>
              <tbody>
                {!isEmpty(patientName)
                  ? localSearchedPatients.map((patient, i) => (
                      <tr
                        key={i}
                        style={
                          highLightIds.includes(patient.id)
                            ? { backgroundColor: "orange" }
                            : {}
                        }
                        className={
                          highLightIds.includes(patient.id) ? "blink_me" : ""
                        }
                      >
                        <td>{patient.id}</td>
                        <td>
                          {
                            <Link
                              data-patientid={patient.id}
                              to={`/patientdetails/${patient.id}`}
                              key={i}
                            >
                              {patient.name}
                            </Link>
                          }
                        </td>
                        <td>{patient.roomNumber}</td>
                        <td>{patient.bedNumber}</td>
                        <td>{patient.doctor}</td>
                      </tr>
                    ))
                  : patients.map((patient, i) => (
                      <tr
                        key={i}
                        style={
                          highLightIds.includes(patient.id)
                            ? { backgroundColor: "orange" }
                            : {}
                        }
                        className={
                          highLightIds.includes(patient.id) ? "blink_me" : ""
                        }
                      >
                        <td>{patient.id}</td>
                        <td>
                          {
                            <Link
                              data-patientid={patient.id}
                              to={`/patientdetails/${patient.id}`}
                              key={i}
                            >
                              {patient.name}
                            </Link>
                          }
                        </td>
                        <td>{patient.roomNumber}</td>
                        <td>{patient.bedNumber}</td>
                        <td>{patient.doctor}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
  const presentationB = (
    <>
      {showApproveModal && (
        <ApproveModal
          setShowApproveModal={setShowApproveModal}
          handleDeleteDocument={handleDeleteDocument}
        />
      )}
      <label>
        <input
          className="radio-input"
          type="radio"
          style={{ marginLeft: "10px", visibility: "hidden" }}
          name="presentation"
          value="presentation1"
          onChange={handleSetPresentation}
        />

        <span
          className={`venue ${residence === "19" && "underline"}`}
          onClick={() => handleResidenceClick("19")}
        >
          Реконструктивна хірургія{" "}
        </span>
        <span
          className={`venue ${residence === "37" && "underline"}`}
          onClick={() => handleResidenceClick("37")}
        >
          Реабілітація
        </span>
      </label>
      {/* <label>
        <input
          className="radio-input"
          type="radio"
          style={{ marginLeft: "10px", visibility: "hidden" }}
          name="presentation"
          value="presentation2"
          onChange={handleSetPresentation}
        />
        <span className="venue">Усі</span>
      </label>*/}
      <div>
        <div>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Листок медичних призначень</title>

          <div className="sidebar">
            <div className="search-container">
              <div>
                <input
                  type="text"
                  placeholder="Пошук..."
                  id="search"
                  className="search-input"
                  name="search"
                  value={patientName}
                  onChange={handleSearchPatientsInputChange}
                  onFocus={() => setShowSuggestions(true)}
                  autoComplete="off"
                />
                {!isEmpty(patientName) && showSuggestions && (
                  <div className="searched-patients-dropdown">
                    {searchedPatients.map((patient, i) => (
                      <a
                        onClick={handleSearchedPatientClick}
                        data-patientid={patient.id}
                        href="#"
                        key={i}
                      >
                        {patient.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="content">
            {patient.id && (
              <>
                <div className="profile">
                  <h2>
                    <span>
                      [{patient.id}] {patient.name}
                    </span>
                  </h2>
                  <p>
                    <span>{patient.historyNumber}</span>
                  </p>
                  <p>
                    Адреса: <span>{patient.address} </span>
                  </p>
                  <p>
                    Тел.: <span>{patient.phone}</span>
                  </p>
                  <p>
                    Відділення: <span>{patient.department}</span>
                  </p>
                  <p>
                    Номер палати: <span>{patient.roomNumber}</span>
                  </p>
                  <p>
                    Ліжко: <span>{patient.bedNumber}</span>
                  </p>
                  <p>
                    Лікар: <span>{patient.doctor}</span>
                  </p>
                  <p>
                    Стать: <span>{patient.gender}</span>
                  </p>
                  <p>
                    Вік: <span>{patient.age}</span>
                  </p>
                  <p>
                    Дата народження: <span>{patient.birthDate}</span>
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="documents">
                    <h3>Список документів пацієнта</h3>
                    {documentsList.map((document, i) => (
                      <a
                        href="#"
                        key={i}
                        onClick={() => {
                          handleSelectDocument(
                            document.medicineListID + "|" + document.patientRef,
                            i
                          );
                        }}
                      >
                        <div
                          className={`document-item ${
                            selectedDocument[i] ? "selected" : ""
                          }`}
                          key={i}
                        >
                          <p>
                            {document.medicineListCreationDate &&
                              formatDate(document).toLocaleDateString()}{" "}
                            - {document.medicineListCreationUser}
                          </p>
                          <p>{document.documentName}</p>
                        </div>
                      </a>
                    ))}
                    {ROLE === "DOCTOR" && (
                      <Link to={`/newlist/${patient.id}`}>
                        Створити Новий Лист
                      </Link>
                    )}
                  </div>
                  <div className="document-preview-container">
                    <div className="buttons">
                      <Link to={`/listdetails/${selectDocument}`}>
                        <button className="edit-button" type="button">
                          Редагуваги
                        </button>
                      </Link>
                      {ROLE == "DOCTOR" && (
                        <Link to={`/listdetails/copy/${selectDocument}`}>
                          <button className="edit-button">Копіювати</button>
                        </Link>
                      )}

                      <div
                        className="trash-ico-container"
                        style={{ marginTop: "3px" }}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => {
                            setShowApproveModal(true);
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ scale: 0.7 }} className="scroll-both">
                      {<ListDetails key={selectDocument} Id={selectDocument} />}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
  return presentation === 1 ? presentationA : presentationB;
}
