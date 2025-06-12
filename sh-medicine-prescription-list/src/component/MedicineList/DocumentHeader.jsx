import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPatientById } from "../../utils/ApiFunctions";

export default function DocumentHeader(props) {
  const [patient, setPatient] = useState({
    id: 0,
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

  useEffect(() => {
    getPatientById(props.id).then((patient) => {setPatient(patient);localStorage.setItem("patient", JSON.stringify(patient))});
  }, []);

  return (
    <div className="medicine-header">
      <div className="medicine-header-container flex">
        {
            <Link
              style={{ color: "#007bff", fontWeight: "bold" }}
              to={`/patientdetails/${props?.id}`}
            >
              Назад
            </Link>
          }
        <div className="flex">
          
          <div className="patinet-details-container">
            <ul>
            <li>
               ПІБ:
              <span className="patient-full-name">{patient.name}</span>
           </li>
            <li>
              Стать: <span className="address-heading">{patient.gender}</span>
            </li>
            <li>
              Вік: <span className="patient-age-row">{patient.age}</span>
            </li>
            <li>
              Дата народження:
              <span className="patient-birthdate-row">{patient.birthDate}</span>
            </li>
            </ul>
          </div>
        </div>
        <div className="patinet-details-container">
          <ul>
            <li>
              Відділення:
              <span className="medical-unit">{patient.department}</span>
            </li>
            <li>
              Номер палати:
              <span className="room-number">{patient.roomNumber}</span>
            </li>
            <li>
              Номер ліжка:
              <span className="bed-number">{patient.bedNumber}</span>
            </li>
            <li>
              Лікар: <span className="doctor-name">{patient.doctor}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
