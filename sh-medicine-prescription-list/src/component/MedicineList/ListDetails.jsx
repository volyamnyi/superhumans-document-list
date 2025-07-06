import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DocumentHeader from "./DocumentHeader";
import List from "./List";
import SuccessModal from "./SuccessModal";

import {
  getMedicineListById,
  updateMedicineListById,
  updateMedicineListStatusByListId,
  isDocumentEditing,
  searchMedicine,
} from "../../utils/ApiFunctions";

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

export default function ListDetails(props) {
  const { Id } = props;
  const id = Id ? Id : useParams().id;
  const isScaled = Id ? true : false;
  const [isNew, setIsNew] = useState(false)

  const [ROLE, setROLE] = useState(localStorage.getItem("businessRole"));
  const [errorMessage, setErrorMessage] = useState("");

  const [medicineList, setMedicineList] = useState({
    medicineListID: null,
    patientRef: null,
    documentName: "",
    medicineListCreationUser: `${localStorage.getItem("sub")}`,
    medicineListCreationDate: null,
    medicineDetails: [],
  });

  const [medicineDetails, setMedicineListItem] = useState([]);
  const [triggerSubmit, setTriggerSubmit] = useState(false);
  const [dates, setDates] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentRowSuggestionIndex, setCurrentRowSuggestionIndex] = useState();
  const [medicineName, setMedicineName] = useState("");
  const [triggerSearchedMedicine, setTriggerSearchedMedicine] = useState(false);
  const [searchedMedicine, setSearchedMedicine] = useState([
    { id: "", name: "" },
  ]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    getMedicineListById(id.split("|")[0]).then((list) => {
      setMedicineList(list);
      setMedicineListItem(medicineList.medicineDetails);
      setDates(getWeekDates(formatDate(list)));
    });
  }, [medicineList.medicineListID]);

  useEffect(() => {
    if (triggerSubmit) {
      (async () => {
        const response = await updateMedicineListById(
          medicineList,
          JSON.parse(localStorage.getItem("patient"))
        );
        if (response.status === 200) {
          //alert("Success");
          setShowSuccessModal(true);
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

  const [renderCount, setRenderCount] = useState(0);
  useEffect(() => {
    if (renderCount < 1) {
      setRenderCount((prevCount) => prevCount + 1);
    }
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    const handlePopState = () => {
      updateMedicineListStatusByListId(id.split("|")[0], "Saved");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [id.split("|")[0]]);

  useEffect(() => {
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
      {showSuccessModal && (
        <SuccessModal setShowSuccessModal={setShowSuccessModal} />
      )}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {!isScaled && <DocumentHeader id={id.split("|")[1]} />}
      <List
        isNew={isNew}
        setIsNew={setIsNew}
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
        isScaled={isScaled}
        handleMedicineRegimeChange={handleMedicineRegimeChange}
      />
    </>
  );
}
