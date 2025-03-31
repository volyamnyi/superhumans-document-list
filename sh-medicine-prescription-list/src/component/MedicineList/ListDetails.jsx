import React from "react";
import { getMedicineListById } from "../../utils/ApiFunctions";
import { updateMedicineListById } from "../../utils/ApiFunctions";
import { updateMedicineListStatusByListId } from "../../utils/ApiFunctions";
import { isDocumentEditing } from "../../utils/ApiFunctions";

import { handleItemChange } from "../../utils/Functions";

import { handleDetailChange } from "../../utils/Functions";

import { handleAddNewMedicineItem } from "../../utils/Functions";
import { handleRemoveMedicineItem } from "../../utils/Functions";

import { handleAddNewDayDetails } from "../../utils/Functions";
import { handleDelNewDayDetails } from "../../utils/Functions";

import { handleMedicineMethodChange } from "../../utils/Functions";

import { isEmpty } from "../../utils/Functions";
import { handleSubmit } from "../../utils/Functions";

import { getWeekDates } from "../../utils/Functions";
import { formatDate } from "../../utils/Functions";
import { searchMedicine } from "../../utils/ApiFunctions";
import DocumentHeader from "./DocumentHeader";

import { handleSearchedMedicineClick } from "../../utils/Functions";
import { handleCurrentRowClick } from "../../utils/Functions";

import List from "./List";

import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ListDetails(props) {
  const { Id } = props;
  const id = Id ? Id : useParams().id;
  const isScaled = Id ? true : false;

  const [ROLE, setROLE] = React.useState(localStorage.getItem("role"));
  const [errorMessage, setErrorMessage] = React.useState("");

  const [medicineList, setMedicineList] = React.useState({
    medicineListID: null,
    patientRef: null,
    documentName: "",
    medicineListCreationUser: `${
      localStorage.getItem("firstName") + " " + localStorage.getItem("lastName")
    }`,
    medicineListCreationDate: null,
    medicineDetails: [],
  });

  const [medicineDetails, setMedicineListItem] = React.useState([]);
  const [triggerSubmit, setTriggerSubmit] = React.useState(false);
  const [dates, setDates] = React.useState([]);

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
    getMedicineListById(id.split("|")[0]).then((list) => {
      setMedicineList(list);
      setMedicineListItem(medicineList.medicineDetails);
      setDates(getWeekDates(formatDate(list)));
    });
  }, [medicineList.medicineListID]);

  React.useEffect(() => {
    if (triggerSubmit) {
      (async () => {
        const response = await updateMedicineListById(medicineList);
        if (response.status === 200) {
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

  const [renderCount, setRenderCount] = React.useState(0);
  React.useEffect(() => {
    if (renderCount < 1) {
      setRenderCount((prevCount) => prevCount + 1);
    }
  }, []);

  React.useEffect(() => {
    !isScaled &&
      updateMedicineListStatusByListId(
        id.split("|")[0],
        localStorage.getItem("sub")
      );

    if (!isScaled) {
      (async () => {
        const result = await isDocumentEditing(id.split("|")[0]);
        if (result.status === 409) {
          setErrorMessage("Документ зараз редагується іншим користувачем.");
          if (ROLE === "DOCTOR") {
            setROLE("BLOCKED_DOCTOR");
          } else if (ROLE === "NURSE") {
            setROLE("BLOCKED_NURSE");
          }
        } else {
          if (ROLE === "BLOCKED_DOCTOR") {
            setROLE("DOCTOR");
          } else if (ROLE === "BLOCKED_NURSE") {
            setROLE("NURSE");
          }
        }
      })();
    }

    return () => {
      updateMedicineListStatusByListId(id.split("|")[0], "Saved");
    };
  }, [renderCount]);

  React.useEffect(() => {
    const handlePopState = () => {
      updateMedicineListStatusByListId(id.split("|")[0], "Saved");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [id.split("|")[0]]);

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      updateMedicineListStatusByListId(id.split("|")[0], "Saved");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [id.split("|")[0]]);

  return (
    <>
    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {!isScaled && <DocumentHeader id={id.split("|")[1]} />}
      <List
        handleItemChange={handleItemChange}
        andleDetailChange={handleDetailChange}
        handleAddNewMedicineItem={handleAddNewMedicineItem}
        handleRemoveMedicineItem={handleRemoveMedicineItem}
        handleAddNewDayDetails={handleAddNewDayDetails}
        handleDelNewDayDetails={handleDelNewDayDetails}
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
        isScaled={isScaled}
      />
      {/*isScaled && <Link
                        to={`/listdetails/${
                          Id
                        }`}
                      >Перегляд</Link>*/}
    </>
  );
}
