import React from "react";
import { searchPatients } from "../utils/ApiFunctions";
import { getPatientById } from "../utils/ApiFunctions";
import { getAllDocumentsByPatientId } from "../utils/ApiFunctions";
import { deleteDocumentById } from "../utils/ApiFunctions";
import { Link, useParams } from "react-router-dom";
import { isEmpty } from "../utils/Functions";
import { formatDate } from "../utils/Functions";

import ListDetails from "./MedicineList/ListDetails";

export default function Home() {
  const { id } = useParams();
  const [patientStateId, setPatientStateId] = React.useState(id);
  const ROLE = localStorage.getItem("businessRole");

  const [documentsList, setDocumentsLList] = React.useState([
    {
      medicineListID: null,
      patientRef: null,
      documentName: "",
      medicineListCreationUser: "",
      medicineListCreationDate: null,
      medicineDetails: [],
    },
  ]);

  const [patientName, setPatientName] = React.useState("");
  const [searchedPatients, setSearchedPatients] = React.useState([
    { id: "", name: "" },
  ]);

  const [patient, setPatient] = React.useState({
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

  const [selectDocument, setSelectDocument] = React.useState("1|1");
  const [selectedDocument, setSelectedDocument] = React.useState([]);

  function handleSelectDocument(link, selectedIndex) {
    setSelectDocument(link);
    localStorage.setItem("selectedIndex", selectedIndex);
    const newSelectedDocumentArr = Array(selectedDocument.length).fill(false);
    newSelectedDocumentArr[selectedIndex] = true;
    setSelectedDocument(newSelectedDocumentArr);
  }

  React.useEffect(() => {
    if (id && patientStateId) {
      getPatientById(patientStateId).then((patient) => {
        setPatientStateId(null);
        return setPatient(patient);
      });
    }
  }, [patient.id]);

  //const [triggerPatientClick, setTriggerPatientClick] = React.useState(false)

  const [showSuggestions, setShowSuggestions] = React.useState(false);

  React.useEffect(() => {
    const fetchDocuments = async () => {
      if (!patient.id) return; // Prevent execution if patient.id is missing

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
    console.log(localStorage.getItem("selectedIndex"));
    newSelectedDocumentArr[localStorage.getItem("selectedIndex") - 1] = true;
    setSelectedDocument(newSelectedDocumentArr);
  }

  return (
    <>
      <div>
        <div>
          {/*<div className="home-page-container">
             <ul className="document-list">
                 {medicineList.map((list) => (
             <li key={list.medicineListID}>
            <Link
             to={`/listdetails/${list.medicineListID}`}
            >
              <span className="document-id">{list.medicineListID}</span>
              {list.documentName}
            </Link>
                </li>
               ))}
                </ul>
                <br/>
            <Link to={"/newlist/1"}>Створити Новий Лист</Link>
             </div>*/}

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
                    {searchedPatients.map((patient,i) => (
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
                    <span>[{patient.id}] {patient.name}</span>
                  </h2>
                  <p><span>{patient.historyNumber}</span></p>
                  <p>Адреса: <span>{patient.address} </span></p>
                  <p>Тел.:  <span>{patient.phone}</span></p>
                  <p>Відділення: <span>{patient.department}</span></p>
                  <p>Номер палати: <span>{patient.roomNumber}</span></p>
                  <p>Ліжко: <span>{patient.bedNumber}</span></p>
                  <p>Лікар: <span>{patient.doctor}</span></p>
                  <p>Стать: <span>{patient.gender}</span></p>
                  <p>Вік: <span>{patient.age}</span></p>
                  <p>Дата народження: <span>{patient.birthDate}</span></p>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="documents">
                    <h3>Список документів пацієнта</h3>
                    {documentsList.map((document, i) => (
                      /*<Link
                        to={`/listdetails/${
                          document.medicineListID + "|" + document.patientRef
                        }`}
                      >*/
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
                            {document.medicineListCreationDate && formatDate(document).toLocaleDateString()} -{" "}
                            {document.medicineListCreationUser}
                          </p>
                          <p>{document.documentName}</p>
                        </div>
                      </a>
                      /*</Link>*/
                    ))}
                    {ROLE === "DOCTOR" && (
                      <Link to={`/newlist/${patient.id}`}>
                        Створити Новий Лист
                      </Link>
                    )}
                    {/*<div className="document-item">
            <p>20.09.2024 12:47 - Ступна Світлана Евгеньевна</p>
            <p>Форма № 027/о «Виписка із медичної карти амбу...»</p>
          </div>
          <div className="document-item selected">
            <p>19.07.2024 10:52 - Сяів Валентина Георгіва</p>
            <p>Форма індивідуального реабілітаційного плану</p>
          </div>
          <div className="document-item selected">
            <p>19.07.2024 10:43 - Сяів Валентина Георгіва</p>
            <p>Prosthetic Observational Gait Scale (POGS)</p>
          </div>
          <div className="document-item">
            <p>19.07.2024 9:29 - Марченко Віталій Васильович</p>
            <p>ДОДАТКОВА УГОДА до Договору (Двомовна)</p>
          </div>
          <div className="document-item">
            <p>16.07.2024 11:14 - Балуи Наталя Іванівна</p>
            <p>Форма № 028/о «Консультаційний висновок»</p>
          </div>
          <div className="document-item">
            <p>04.07.2024 17:24 - Швець Наталія Юріївна</p>
            <p>Форма оцiновання iндивидуальних потреб</p>
          </div>
          <div className="document-item">
            <p>03.07.2024 16:39 - Оверко Віра</p>
          </div>*/}
                  </div>
                  <div className="document-preview-container">
                    <div className="buttons">
                      <Link to={`/listdetails/${selectDocument}`}>
                        <button className="btn">Редагуваги</button>
                      </Link>

                      <button
                        className="btn red"
                        onClick={() => handleDeleteDocument(selectDocument)}
                      >
                        X
                      </button>
                    </div>
                    <div style={{ scale: 0.7 }} className="scroll-both">
                      {<ListDetails key={selectDocument} Id={selectDocument} />}
                    </div>
                  </div>
                </div>

                {}
              </>
            )}
            {/*<div className="comment-section">
          <h3>Коментар:</h3>
          <input
            type="text"
            placeholder="КОМЕНТАР:"
            style={{ border: "1px solid #ccc" }}
          />
          <div className="buttons">
            <button className="btn">Редагуваги</button>
            <button className="btn red">X</button>
            <button className="btn">📎</button>
            <button className="btn">📄</button>
            <button className="btn">✉</button>
            <button className="btn">ℹ</button>
            <button className="btn red">🗑</button>
          </div>
          <p>Датак 4</p>
          <p>
            Дата 15.10.2024 Адреса Херсонська область, с.Олександрівка, вул.
            Ворошилова, буд. 55
          </p>
          <p>Паціент Джуда Олер Васильович</p>
          <p>Антропометричний дан : вага зріст Телефон 380(304)-81-17</p>
          <p>
            Діагноз Ампутація правої нижньої кінцівки на рівні середньої третини
            гомілки
          </p>
          <p>Причина ампутацї МТ</p>
          <p>Шифр виробы: К4</p>
          <p>Стопа: Примітки: Замина лайнера та кускорiмчада;</p>
          <img src="diagram.jpg" alt="Prosthetic Diagram" className="diagram" />
        </div>*/}
          </div>
        </div>
      </div>
    </>
  );
}
