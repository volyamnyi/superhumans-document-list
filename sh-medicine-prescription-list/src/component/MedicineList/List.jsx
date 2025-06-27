import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleAddNewDayDetails4 } from "../../utils/Functions";
import { handleAddNewMedicineItem2 } from "../../utils/Functions";
import { generateDEDoc } from "../../utils/ApiFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { formatDateToISO } from "../../utils/Functions";

export default function List({
  isNew,
  patientId,
  handleItemChange,
  handleDetailChange,
  handleRemoveMedicineItem,
  handleMedicineMethodChange,
  handleSubmit,
  handleSearchedMedicineClick,
  handleCurrentRowClick,
  medicineList,
  medicineDetails,
  currentRowSuggestionIndex,
  ROLE,
  setMedicineListItem,
  setSearchedMedicine,
  isEmpty,
  setMedicineList,
  setTriggerSubmit,
  setCurrentRowSuggestionIndex,
  setMedicineName,
  searchMedicine,
  setTriggerSearchedMedicine,
  setShowSuggestions,
  showSuggestions,
  triggerSearchedMedicine,
  searchedMedicine,
  isScaled,
  handleMedicineRegimeChange,
}) {
  const [presentation, setPresentation] = useState(3);
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const [showRegime, setShowRegime] = useState(!isNew);

  function handleAutoPlan(event) {
    const selectedValue = event.target.value;
    if (selectedValue === "autoPlan1") {
      setPresentation(1);
      setMedicineListItem([]);
    } else if (selectedValue === "autoPlan2") {
      setPresentation(2);
      setMedicineListItem([]);
    }
    if (selectedValue === "autoPlan1") {
      setPresentation(1);
      setMedicineListItem([]);
    } else if (selectedValue === "autoPlan3") {
      setPresentation(3);
      setMedicineListItem([]);
    }
  }

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 6);
    return futureDate.toISOString().split("T")[0];
  });

  const [startDate2, setStartDate2] = useState("");
  const [endDate2, setEndDate2] = useState("");

  const [dateRange, setDateRange] = useState([]);
  const [dateRange2, setDateRange2] = useState([]);

  const [enableAddNewMedicine, setEnableAddNewMedicine] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(true);

  const getDatesInRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);

    const diffInTime = endDate - current;
    const diffInDays = diffInTime / (1000 * 60 * 60 * 24);

    if (diffInDays > 7) {
      alert(
        "Різниця між кінцевою і початковою датами не повинна бути більшою ніж 7 днів"
      );
      return;
    }

    while (current <= endDate) {
      dates.push(new Date(current).toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };
  const handleRangeChange = (range) => {
    setEnableAddNewMedicine(true);
  };

  useEffect(() => {
    if (!startDate) {
      setStartDate(medicineDetails[0]?.medicineDetails[0]?.date);
    }
    if (!endDate) {
      setEndDate(
        medicineDetails[0]?.medicineDetails[
          medicineDetails[0]?.medicineDetails.length - 1
        ]?.date
      );
    }
  }, [medicineDetails]);

  useEffect(() => {
    if (!startDate2) {
      setStartDate2(medicineDetails[0]?.medicineDetails[0]?.date);
    }
    if (!endDate2) {
      setEndDate2(
        medicineDetails[0]?.medicineDetails[
          medicineDetails[0]?.medicineDetails.length - 1
        ]?.date
      );
    }
  }, [medicineDetails]);

  useEffect(() => {
    if (startDate && endDate && new Date(startDate) <= new Date(endDate)) {
      const range = getDatesInRange(startDate, endDate);
      setDateRange(range);
      handleRangeChange(range);
    } else {
      setDateRange([]);
      handleRangeChange([]);
    }
  }, [startDate, endDate]);

  /*useEffect(() => {
    if (startDate2 && endDate2 && new Date(startDate2) <= new Date(endDate2)) {
      const range = getDatesInRange(startDate2, endDate2);
      setDateRange2(range);
      handleRangeChange(range);
    } else {
      setDateRange2([]);
      handleRangeChange([]);
    }
  }, [startDate2, endDate2]);*/

  function getDatePicker() {
    return (
      <div>
        <label>
          Від:&nbsp;&nbsp;
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              const date = new Date(e.target.value);
              date.setDate(date.getDate() + 6);
              const result = formatDateToISO(date);
              setEndDate(result);
            }}
            className="border p-1 rounded"
          />
        </label>
        {/*<label>
          До:&nbsp;&nbsp;
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-1 rounded"
          />
        </label>*/}
        <br></br>
      </div>
    );
  }

  function getDatePicker2() {
    return (
      <div>
        <label>
          Від:&nbsp;&nbsp;
          <input
            type="date"
            value={startDate2}
            onChange={(e) => setStartDate2(e.target.value)}
            className="border p-1 rounded"
          />
        </label>
        <label>
          &nbsp;&nbsp;До:&nbsp;&nbsp;
          <input
            type="date"
            value={endDate2}
            onChange={(e) => setEndDate2(e.target.value)}
            className="border p-1 rounded"
          />
        </label>
        <br></br>
      </div>
    );
  }

  function medicineDatePicker() {
    return (
      <>
        <h3 className="date-picker-heading">Оберіть початкову дату</h3>
        {getDatePicker()}
      </>
    );
  }
  function handleGenerateDEDoc() {
    const now = new Date();
    const plusThreeHours = new Date(
      now.getTime() + 3 * 60 * 60 * 1000
    ).toISOString();
    generateDEDoc(medicineList.medicineListID, plusThreeHours);
  }

  return (
    <>
      {/* first*/}
      <form
        className="flex"
        onSubmit={(e) =>
          handleSubmit(
            e,
            setMedicineList,
            setTriggerSubmit,
            medicineDetails,
            isNew,
            `/patientdetails/${patientId}`,
            navigate
          )
        }
      >
        <div className="medicine-container">
          <div className="marks">
            Позначення: &nbsp;
            <div className="day-cell">
              <label
                className="day-cell-input-label"
                style={{ backgroundColor: "lightblue" }}
              ></label>{" "}
              &nbsp;-{" "}
              <span>
                {" "}
                &nbsp;<strong>Заплановано</strong>
              </span>
            </div>
            &nbsp;
            <div className="day-cell">
              <label
                className="day-cell-input-label"
                style={{ backgroundColor: "lightgreen" }}
              ></label>{" "}
              &nbsp;- <span> &nbsp;Виконано&nbsp;</span>
            </div>
            <div className="day-cell">
              <label
                className="day-cell-input-label"
                style={{ backgroundColor: "#fff" }}
              ></label>{" "}
              &nbsp;- <span> &nbsp;Не заплановано</span>
            </div>
          </div>
          <div className="medicine-regime-container">
            {showRegime && (
              <textarea
                value={medicineDetails[0]?.regime}
                className=""
                disabled={isScaled}
                onChange={(e) => {
                  !isScaled &&
                    ROLE === "DOCTOR" &&
                    handleMedicineRegimeChange(
                      e,
                      "regime",
                      setMedicineListItem
                    );
                }}
              ></textarea>
            )}

            {/*<div className="date-picker-container">
              {!isScaled && showRegime && getDatePicker2()}
              {!isScaled && showRegime && (
                <div className="arrows-container">
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    onClick={() => {
                      setStartDate2((prevValue) => {
                        const newDate = new Date(prevValue);
                        newDate.setDate(newDate.getDate() - 1);
                        return formatDateToISO(newDate);
                      });
                      setEndDate2((prevValue) => {
                        const newDate = new Date(prevValue);
                        newDate.setDate(newDate.getDate() - 1);
                        return formatDateToISO(newDate);
                      });
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    onClick={() => {
                      setStartDate2((prevValue) => {
                        const newDate = new Date(prevValue);
                        newDate.setDate(newDate.getDate() + 1);
                        return formatDateToISO(newDate);
                      });
                      setEndDate2((prevValue) => {
                        const newDate = new Date(prevValue);
                        newDate.setDate(newDate.getDate() + 1);
                        return formatDateToISO(newDate);
                      });
                    }}
                  />
                </div>
              )}
            </div>*/}
          </div>
          <div className="medicine-row-container">
            <div className="medicine-date-picker">
              {isNew && showDatePicker && medicineDatePicker()}
            </div>
            <div className="medicine-method-column">Метод</div>
            {medicineDetails?.map((medicineRow, i) => (
              <div className="medicine-row" key={i}>
                {localStorage.setItem("addIndex", i)}
                {!isScaled && ROLE == "DOCTOR" ? (
                  <div className="trash-ico-container">
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() =>
                        handleRemoveMedicineItem(setMedicineListItem, i)
                      }
                    />
                  </div>
                ) : (
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                )}
                <div className="medicine-name">
                  <textarea
                    style={{ fontWeight: "bold" }}
                    className="auto-resize-textarea"
                    ref={textareaRef}
                    key={i}
                    type="text"
                    disabled={isScaled}
                    name="medicineName"
                    data-key={i}
                    onChange={(e) => {
                      ROLE === "DOCTOR" &&
                        !isScaled &&
                        handleItemChange(
                          e,
                          medicineRow.id,
                          setMedicineListItem,
                          isEmpty,
                          searchMedicine,
                          setSearchedMedicine,
                          textareaRef
                        );
                    }}
                    onClick={(e) => {
                      ROLE === "DOCTOR" &&
                        !isScaled &&
                        handleCurrentRowClick(
                          e,
                          i,
                          medicineRow.medicineName,
                          setSearchedMedicine,
                          setCurrentRowSuggestionIndex,
                          setMedicineName,
                          setTriggerSearchedMedicine
                        );
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    value={medicineRow.medicineName}
                  ></textarea>
                  {currentRowSuggestionIndex === i &&
                    showSuggestions &&
                    triggerSearchedMedicine && (
                      <div className="searched-patients-dropdown">
                        {searchedMedicine.map((medicine) => (
                          <a
                            onClick={(e) => {
                              !isScaled &&
                                handleSearchedMedicineClick(
                                  e,
                                  medicineRow.id,
                                  medicine.name,
                                  setMedicineListItem,
                                  setShowSuggestions,
                                  setTriggerSearchedMedicine,
                                  textareaRef
                                );
                            }}
                            href="#"
                          >
                            {medicine.name}
                          </a>
                        ))}
                      </div>
                    )}
                </div>
                <div className="medicine-method">
                  <textarea
                    type="text"
                    name="method"
                    style={{ fontWeight: "bold" }}
                    className="auto-resize-textarea"
                    disabled={isScaled}
                    value={medicineRow.medicineMethod}
                    onChange={(e) => {
                      !isScaled &&
                        ROLE === "DOCTOR" &&
                        handleMedicineMethodChange(
                          e,
                          medicineRow.id,
                          "medicineMethod",
                          setMedicineListItem
                        );
                    }}
                  ></textarea>
                </div>
                {!isScaled && ROLE == "DOCTOR" && (
                  <button
                    type="button"
                    className="fill-all-button"
                    onClick={() =>
                      handleAddNewDayDetails4(
                        medicineDetails,
                        i,
                        setMedicineListItem,
                        dateRange
                      )
                    }
                  >
                    Заповнити все
                  </button>
                )}
                {medicineRow.medicineDetails?.map((details, j) => {
                  return (
                    <div className="medicine-presc-details-row">
                      {details.date >= startDate2 &&
                        details.date <= endDate2 && (
                          <div className="medicine-presc-details-row-first-div">
                            <div
                              className="medicine-date"
                              key={j}
                              style={{ fontWeight: "bold" }}
                            >
                              {details.date}
                              <div className="day-period">
                                <div>Р</div>
                                <div>Д</div>
                                <div>В</div>
                                <div>Н</div>
                              </div>
                            </div>
                            <div
                              key={details.id}
                              className="medicine-presc-details-column"
                            >
                              <div className="day-cells-container">
                                {["morning", "day", "evening", "night"].map(
                                  (period) => (
                                    <div key={period} className="day-cell">
                                      <label
                                        className="day-cell-input-label"
                                        style={
                                          details[period].isPlanned &&
                                          !details[period].isCompleted
                                            ? { backgroundColor: "lightblue" }
                                            : details[period].isCompleted
                                            ? { backgroundColor: "lightgreen" }
                                            : {}
                                        }
                                      >
                                        <input
                                          className="day-cell-input"
                                          type="checkbox"
                                          checked={
                                            ROLE === "NURSE"
                                              ? details[period].isCompleted
                                              : details[period].isPlanned
                                          }
                                          onChange={(e) => {
                                            if (
                                              ROLE === "NURSE" &&
                                              details[period].isPlanned
                                            ) {
                                              !isScaled &&
                                                handleDetailChange(
                                                  e,
                                                  medicineRow.id,
                                                  details.id,
                                                  period,
                                                  "isCompleted",
                                                  setMedicineListItem
                                                );
                                            } else if (
                                              ROLE === "DOCTOR" &&
                                              !details[period].isCompleted
                                            ) {
                                              !isScaled &&
                                                handleDetailChange(
                                                  e,
                                                  medicineRow.id,
                                                  details.id,
                                                  period,
                                                  "isPlanned",
                                                  setMedicineListItem
                                                );
                                            }
                                          }}
                                        />
                                      </label>
                                      {/*<textarea
                                        style={{ fontWeight: "bold" }}
                                        type="text"
                                        name="medicineDose"
                                        value={details[period].medicineDose}
                                        disabled={isScaled}
                                        onChange={(e) => {
                                          !isScaled &&
                                            handleDetailChange(
                                              e,
                                              medicineRow.id,
                                              details.id,
                                              period,
                                              "medicineDose",
                                              setMedicineListItem
                                            );
                                        }}
                                        className="day-cell-dose-input"
                                      ></textarea>*/}
                                      {/*<input
                                          style={{ fontWeight: "bold" }}
                                          name="time"
                                          type="time"
                                          className="day-cell-time-input"
                                          value={
                                            details[period].time === "" &&
                                            period === "morning"
                                              ? "06:00"
                                              : details[period].time === "" &&
                                                period === "day"
                                              ? "12:00"
                                              : details[period].time === "" &&
                                                period === "evening"
                                              ? "18:00"
                                              : details[period].time === "" &&
                                                period === "night"
                                              ? "00:00"
                                              : details[period].time
                                          }
                                          onChange={(e) => {
                                            !isScaled &&
                                              handleDetailChange(
                                                e,
                                                medicineRow.id,
                                                details.id,
                                                period,
                                                "time",
                                                setMedicineListItem
                                              );
                                          }}
                                        />*/}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      {/*medicineRow.medicineDetails.length - 1 == j &&
                        ROLE === "DOCTOR" &&
                        !isScaled &&
                        isNew && (
                          <button
                            className="plus"
                            type="button"
                            onClick={() =>
                              handleAddNewDayDetails2(
                                medicineDetails,
                                i,
                                j,
                                setMedicineListItem,
                                dateRange
                              )
                            }
                          >
                            +
                          </button>
                        )}

                      {medicineRow.medicineDetails.length - 1 == j &&
                        medicineRow.medicineDetails.length > 1 &&
                        ROLE === "DOCTOR" &&
                        !isScaled && (
                          <button
                            style={{ marginLeft: "15px" }}
                            className="plus danger minus"
                            type="button"
                            onClick={() =>
                              handleDelNewDayDetails2(
                                medicineDetails,
                                i,
                                j,
                                setMedicineListItem
                              )
                            }
                          >
                            -
                          </button>
                        )*/}
                    </div>
                  );
                })}
              </div>
            ))}
            {!isScaled && ROLE === "DOCTOR" && (
              <button
                className="add-button"
                disabled={!enableAddNewMedicine}
                type="button"
                onClick={() => {
                  setShowDatePicker(false);
                  handleAddNewMedicineItem2(
                    medicineList,
                    setMedicineListItem,
                    dateRange,
                    setShowRegime,
                    localStorage.getItem("addIndex")
                  );
                }}
              >
                Додати
              </button>
            )}

            {/*!isScaled && ROLE === "DOCTOR" && medicineDetails.length > 1 && (
              <button
                type="button"
                className="danger"
                onClick={() => handleRemoveMedicineItem(setMedicineListItem)}
                style={{ marginLeft: "1px" }}
              >
                Видалити
              </button>
            )*/}
          </div>
        </div>
        {!isScaled && (
          <div className="save-generate-buttons-container">
            <button
              className="save-button"
              onSubmit={(e) =>
                handleSubmit(
                  e,
                  setMedicineList,
                  setTriggerSubmit,
                  medicineDetails,
                  isNew,
                  `/patientdetails/${patientId}`,
                  navigate
                )
              }
            >
              Зберегти
            </button>

            {((localStorage.getItem("businessRole") == "NURSE" ||
              localStorage.getItem("userRole") == "ADMIN") && (
                <button
                  type="button"
                  className="save-button"
                  onClick={handleGenerateDEDoc}
                >
                  Згенерувати в ДЕ
                </button>
              ))}
          </div>
        )}
      </form>
    </>
  );
}
