import { useState, useEffect } from "react";
import DocumentHeader from "./DocumentHeader";
import List from "./List";

import { addNewMedicineList, searchMedicine } from "../../utils/ApiFunctions";

import {
  handleItemChange,
  handleDetailChange,
  handleAddNewMedicineItem,
  handleRemoveMedicineItem,
  handleAddNewDayDetails,
  handleAddNewDayDetails2,
  handleDelNewDayDetails,
  handleDelNewDayDetails2,
  handleMedicineMethodChange,
  isEmpty,
  handleSubmit,
  getWeekDates,
  getCustomWeekDates,
  formatDate,
  handleSearchedMedicineClick,
  handleCurrentRowClick,
  handleMedicineRegimeChange,
} from "../../utils/Functions";

import { useParams } from "react-router-dom";

export default function NewList() {
  const { id } = useParams();

  const ROLE = localStorage.getItem("businessRole");

  const [medicineList, setMedicineList] = useState({
    medicineListID: 0,
    patientRef: id,
    documentName: "Листок лікарських призначень (стаціонар)",
    medicineListCreationUser: `${
      localStorage.getItem("sub")
    }`,
    medicineListCreationDate: new Date(),
    medicineDetails: [],
  });

  const [medicineDetails, setMedicineListItem] = useState([]);
  const [triggerSubmit, setTriggerSubmit] = useState(false);

  const dates = getWeekDates(new Date());

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentRowSuggestionIndex, setCurrentRowSuggestionIndex] = useState();
  const [medicineName, setMedicineName] = useState("");
  const [triggerSearchedMedicine, setTriggerSearchedMedicine] = useState(false);
  const [searchedMedicine, setSearchedMedicine] = useState([
    { id: "", name: "" },
  ]);

  useEffect(() => {
    if (triggerSubmit) {
      (async () => {
        const response = await addNewMedicineList(medicineList, JSON.parse(localStorage.getItem("patient")));
        if (response.status === 201) {
          alert("Success");
        } else {
          alert(response);
        }
        setTriggerSubmit(false);
      })();
    }
  }, [medicineList, triggerSubmit]);

  useEffect(() => {
    if (triggerSearchedMedicine) {
      (async () => {
        if (!isEmpty(medicineName)) {
          searchMedicine(medicineName.trim()).then((searchedMedicine) => {
            setSearchedMedicine((prevValues) => {
              return [...searchedMedicine];
            });
          });
        } else {
          setSearchedMedicine([{ id: 0, name: "" }]);
        }
      })();
    }
  }, [medicineName]);

  return (
    <>
      <DocumentHeader id={id} />
      <List
        isNew={true}
        patientId={id}
        handleItemChange={handleItemChange}
        andleDetailChange={handleDetailChange}
        handleAddNewMedicineItem={handleAddNewMedicineItem}
        handleRemoveMedicineItem={handleRemoveMedicineItem}
        handleAddNewDayDetails={handleAddNewDayDetails}
        handleAddNewDayDetails2={handleAddNewDayDetails2}
        handleDelNewDayDetails={handleDelNewDayDetails}
        handleDelNewDayDetails2={handleDelNewDayDetails2}
        handleMedicineMethodChange={handleMedicineMethodChange}
        handleSubmit={handleSubmit}
        handleSearchedMedicineClick={handleSearchedMedicineClick}
        handleCurrentRowClick={handleCurrentRowClick}
        dates={dates}
        medicineList={medicineList}
        medicineDetails={medicineDetails}
        currentRowSuggestionIndex={currentRowSuggestionIndex}
        ROLE={ROLE}
        setMedicineListItem={setMedicineListItem}
        handleDetailChange={handleDetailChange}
        setSearchedMedicine={setSearchedMedicine}
        isEmpty={isEmpty}
        setMedicineList={setMedicineList}
        setTriggerSubmit={setTriggerSubmit}
        setShowSuggestions={setShowSuggestions}
        setCurrentRowSuggestionIndex={setCurrentRowSuggestionIndex}
        setMedicineName={setMedicineName}
        searchMedicine={searchMedicine}
        setTriggerSearchedMedicine={setTriggerSearchedMedicine}
        showSuggestions={showSuggestions}
        triggerSearchedMedicine={triggerSearchedMedicine}
        searchedMedicine={searchedMedicine}
        handleMedicineRegimeChange={handleMedicineRegimeChange}
      />
    </>
  );
}
