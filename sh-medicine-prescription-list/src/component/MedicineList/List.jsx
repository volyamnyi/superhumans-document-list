import React, { useState, useRef } from "react";

export default function List({
  isNew,
  handleItemChange,
  handleDetailChange,
  handleAddNewMedicineItem,
  handleRemoveMedicineItem,
  handleAddNewDayDetails,
  handleAddNewDayDetails2,
  handleDelNewDayDetails,
  handleDelNewDayDetails2,
  handleMedicineMethodChange,
  handleSubmit,
  handleSearchedMedicineClick,
  handleCurrentRowClick,
  dates,
  customDates,
  setDaysCount,
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
}) {
  const [presentation, setPresentation] = useState(1);

  function handleAutoPlan(event) {
    const selectedValue = event.target.value;
    if (selectedValue === "autoPlan1") {
      setPresentation(1);
      setMedicineListItem([])
    } else if (selectedValue === "autoPlan2") {
      setPresentation(2);
      setMedicineListItem([])
    }
  }

  return (
    <>
      <div className="type-of-plan-container">
        {ROLE === "DOCTOR" && !isScaled && isNew && (
          <>
            <span> Вручну</span>
            <input
              className="radio-input"
              type="radio"
              style={{ marginLeft: "10px" }}
              name="autoPlan"
              value="autoPlan1"
              onChange={handleAutoPlan}
            />
          </>
        )}
        {ROLE === "DOCTOR" && !isScaled && isNew && (
          <>
            <span> Запланувати</span>
            <input
              className="radio-input"
              type="radio"
              style={{ marginLeft: "10px" }}
              name="autoPlan"
              value="autoPlan2"
              onChange={handleAutoPlan}
            />
          </>
        )}
      </div>
      {presentation === 1 ? (
        <form
          onSubmit={(e) =>
            handleSubmit(e, setMedicineList, setTriggerSubmit, medicineDetails)
          }
        >
          <div className="medicine-container">
            <div className="medicine-left">
              <div className="medicine-method-column">Метод</div>
              <div className="medicine-name-column">Назва</div>
            </div>
            <div className="medicine-date-container flex">
              {dates.map((date, i) => (
                <div className="medicine-date" key={i}>
                  {date}
                  <div className="day-period">
                    <div>Р</div>
                    <div>Д</div>
                    <div>В</div>
                    <div>Н</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="medicine-row-container">
              {medicineDetails?.map((medicineRow, i) => (
                <div className="medicine-row" key={i}>
                  <div className="medicine-method">
                    <select
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
                    >
                      <option value="ВВК">ВВК</option>
                      <option value="ВВС">ВВС</option>
                      <option value="ВМ">ВМ</option>
                      <option value="ПШ">ПШ</option>
                      <option value="Пер">Пер</option>
                      <option value="" />
                    </select>
                  </div>
                  <div className="medicine-name">
                    <input
                      key={i}
                      type="text"
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
                            setSearchedMedicine
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
                    ></input>
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
                                    setTriggerSearchedMedicine
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

                  {medicineRow.medicineDetails.map((details, j) => {
                    return (
                      <div className="medicine-presc-details-row">
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
                                  <input
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
                                  />
                                  <textarea
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
                                  ></textarea>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        {medicineRow.medicineDetails.length - 1 == j &&
                          medicineRow.medicineDetails.length < 21 &&
                          ROLE === "DOCTOR" &&
                          !isScaled && (
                            <button
                              className="plus"
                              type="button"
                              onClick={() =>
                                handleAddNewDayDetails(
                                  medicineDetails,
                                  i,
                                  j,
                                  setMedicineListItem,
                                  dates
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
                              className="plus danger"
                              type="button"
                              onClick={() =>
                                handleDelNewDayDetails(
                                  medicineDetails,
                                  i,
                                  j,
                                  setMedicineListItem
                                )
                              }
                            >
                              -
                            </button>
                          )}
                      </div>
                    );
                  })}
                </div>
              ))}
              {!isScaled && ROLE === "DOCTOR" && (
                <button
                  type="button"
                  onClick={() =>
                    handleAddNewMedicineItem(
                      medicineList,
                      setMedicineListItem,
                      dates
                    )
                  }
                >
                  Додати
                </button>
              )}

              {!isScaled && ROLE === "DOCTOR" && medicineDetails.length > 1 && (
                <button
                  type="button"
                  className="danger"
                  onClick={() => handleRemoveMedicineItem(setMedicineListItem)}
                  style={{ marginLeft: "1px" }}
                >
                  Видалити
                </button>
              )}
            </div>
          </div>
          {!isScaled && (
            <button
              className="save-button"
              onSubmit={(e) =>
                handleSubmit(
                  e,
                  setMedicineList,
                  setTriggerSubmit,
                  medicineDetails
                )
              }
            >
              Зберегти
            </button>
          )}
        </form>
      ) : (/** second*/
        <form
          onSubmit={(e) =>
            handleSubmit(e, setMedicineList, setTriggerSubmit, medicineDetails)
          }
        >
          <div className="medicine-container">
            <div className="medicine-left">
              <div className="medicine-method-column">Метод</div>
              <div className="medicine-name-column">Назва</div>
            </div>
            <div className="medicine-date-container flex">
              {dates.map((date, i) => (
                <div className="medicine-date" key={i}>
                  {date}
                  <div className="day-period">
                    <div>Р</div>
                    <div>Д</div>
                    <div>В</div>
                    <div>Н</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="medicine-row-container">
              {medicineDetails?.map((medicineRow, i) => (
                <div className="medicine-row" key={i}>
                  <div className="medicine-method">
                    <select
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
                    >
                      <option value="ВВК">ВВК</option>
                      <option value="ВВС">ВВС</option>
                      <option value="ВМ">ВМ</option>
                      <option value="ПШ">ПШ</option>
                      <option value="Пер">Пер</option>
                      <option value="" />
                    </select>
                  </div>
                  <div className="medicine-name">
                    <input
                      key={i}
                      type="text"
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
                            setSearchedMedicine
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
                    ></input>
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
                                    setTriggerSearchedMedicine
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

                  {medicineRow.medicineDetails.map((details, j) => {
                    return (
                      <div className="medicine-presc-details-row">
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
                                  <input
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
                                  />
                                  <textarea
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
                                  ></textarea>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        {medicineRow.medicineDetails.length - 1 == j &&
                          medicineRow.medicineDetails.length < 21 &&
                          ROLE === "DOCTOR" &&
                          !isScaled && (
                            <button
                              className="plus"
                              type="button"
                              onClick={() =>
                                handleAddNewDayDetails2(
                                  medicineDetails,
                                  i,
                                  j,
                                  setMedicineListItem,
                                  dates
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
                              className="plus danger"
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
                          )}
                      </div>
                    );
                  })}
                </div>
              ))}
              {!isScaled && ROLE === "DOCTOR" && (
                <button
                  type="button"
                  onClick={() =>
                    handleAddNewMedicineItem(
                      medicineList,
                      setMedicineListItem,
                      dates
                    )
                  }
                >
                  Додати
                </button>
              )}

              {!isScaled && ROLE === "DOCTOR" && medicineDetails.length > 1 && (
                <button
                  type="button"
                  className="danger"
                  onClick={() => handleRemoveMedicineItem(setMedicineListItem)}
                  style={{ marginLeft: "1px" }}
                >
                  Видалити
                </button>
              )}
            </div>
          </div>
          {!isScaled && (
            <button
              className="save-button"
              onSubmit={(e) =>
                handleSubmit(
                  e,
                  setMedicineList,
                  setTriggerSubmit,
                  medicineDetails
                )
              }
            >
              Зберегти
            </button>
          )}
        </form>
      )}
    </>
  );
}
