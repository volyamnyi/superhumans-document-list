import {React, useEffect, useState}  from "react";
import { getPatientById } from "../../utils/ApiFunctions";
import { Link } from "react-router-dom";

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
    getPatientById(props.id).then((patient) => setPatient(patient));
  }, []);

  return (
    <div className="medicine-header">
      <div className="medicine-header-container flex">
        <div className="flex">
          {
            <Link
              style={{ color: "#007bff", fontWeight: "bold" }}
              to={`/${props?.id}`}
            >
              Назад
            </Link>
          }
          <div className="patient-address-container flex">
            Адреса:
            <span className="patient-address-row">{patient.address}</span>
          </div>
          <div className="patient-gender-age-container flex">
            Стать: <span className="address-heading">{patient.gender}</span>
            Вік: <span className="patient-age-row">{patient.age}</span>
            <br />
            <span className="patient-birthdate-row">
              {" "}
              Дата народження: {patient.birthDate}
            </span>
          </div>
        </div>
        <div className="patinet-details-container">
          <ul>
            <li>
              Відділення:
              <span className="medical-unit">{patient.department}</span>
            </li>
            <li>
              ПІБ:
              <span className="patient-full-name">{patient.name}</span>
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
