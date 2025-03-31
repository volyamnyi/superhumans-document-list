import React from "react";

import { addNewMedicineList } from "../../utils/ApiFunctions";
import { handleItemChange } from "../../utils/Functions";
import { handleDetailChange } from "../../utils/Functions";
import { handleAddNewMedicineItem } from "../../utils/Functions";
import { handleAddNewDayDetails } from "../../utils/Functions";
import { handleMedicineMethodChange } from "../../utils/Functions";
import { handleSubmit } from "../../utils/Functions";
import { getWeekDates } from "../../utils/Functions";
import DocumentHeader from "./DocumentHeader";
import { isEmpty } from "../../utils/Functions";
import { searchMedicine } from "../../utils/ApiFunctions";
import { handleCurrentRowClick } from "../../utils/Functions";
import { handleSearchedMedicineClick } from "../../utils/Functions";
import List from "./List";

import { useParams } from "react-router-dom";

export default function NewList() {
  const { id } = useParams();
  
  const ROLE = localStorage.getItem("role");
  
  const [medicineList, setMedicineList] = React.useState({
    medicineListID: 0,
    patientRef: id,
    documentName: "Листок лікарських призначень (стаціонар)",
    medicineListCreationUser: `${
      localStorage.getItem("firstName") + " " + localStorage.getItem("lastName")
    }`,
    medicineListCreationDate: new Date(),
    medicineDetails: [],
  });

  const [medicineDetails, setMedicineListItem] = React.useState([]);
  const [triggerSubmit, setTriggerSubmit] = React.useState(false);

  const dates = getWeekDates(new Date());

  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [currentRowSuggestionIndex, setCurrentRowSuggestionIndex] =
    React.useState();
  const [medicineName, setMedicineName] = React.useState("");
  const [triggerSearchedMedicine, setTriggerSearchedMedicine] =
    React.useState(false);
  const [searchedMedicine, setSearchedMedicine] = React.useState([
    { id: "", name: "" },
  ]);

  React.useEffect(() => {
    if (triggerSubmit) {
      (async () => {
        const response = await addNewMedicineList(medicineList);
        if (response.status === 201) {
          alert("Success");
        } else {
          alert(response);
        }
        setTriggerSubmit(false);
      })();
    }
  }, [medicineList, triggerSubmit]);

  React.useEffect(() => {
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
        handleItemChange={handleItemChange}
        andleDetailChange={handleDetailChange}
        handleAddNewMedicineItem={handleAddNewMedicineItem}
        handleAddNewDayDetails={handleAddNewDayDetails}
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
      />
    </>
  );
}
