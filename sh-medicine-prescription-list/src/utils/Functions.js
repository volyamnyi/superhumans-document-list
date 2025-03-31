import { nanoid } from "nanoid";
import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export function handleAddNewDayDetails(
  medicineDetails,
  rowIndex,
  colIndex,
  setMedicineListItem,
  dates
) {
  medicineDetails[rowIndex]?.medicineDetails?.push({
    id: nanoid(),
    date: dates[colIndex],
    morning: {
      id: nanoid(),
      time: "",
      medicineDose: "",
      isPlanned: false,
      isCompleted: false,
      isOverdue: false,
      isFailed: false,
    },
    day: {
      id: nanoid(),
      time: "",
      medicineDose: "",
      isPlanned: false,
      isCompleted: false,
      isOverdue: false,
      isFailed: false,
    },
    evening: {
      id: nanoid(),
      time: "",
      medicineDose: "",
      isPlanned: false,
      isCompleted: false,
      isOverdue: false,
      isFailed: false,
    },
    night: {
      id: nanoid(),
      time: "",
      medicineDose: "",
      isPlanned: false,
      isCompleted: false,
      isOverdue: false,
      isFailed: false,
    },
  });

  setMedicineListItem([...medicineDetails]);
}

export function handleDelNewDayDetails(
  medicineDetails,
  rowIndex,
  colIndex,
  setMedicineListItem
) {
  medicineDetails[rowIndex]?.medicineDetails?.pop();
  //setMedicineListItem(prevList => prevList.slice(0, -1));
  setMedicineListItem([...medicineDetails]);
}

export function handleAddNewMedicineItem(
  medicineList,
  setMedicineListItem,
  dates
) {
  setMedicineListItem((prevValue) => [
    ...prevValue,
    {
      id: nanoid(),
      //medicineListRef:medicineList.medicineListID,
      medicineListItemEditUser: medicineList.medicineListCreationUser,
      medicineListItemEditDate: new Date(),
      medicineName: "",
      medicineMethod: "",
      medicineDetails: [
        {
          id: nanoid(),
          date: dates[0],
          morning: {
            id: nanoid(),
            time: "",
            medicineDose: "",
            isPlanned: false,
            isCompleted: false,
            isOverdue: false,
            isFailed: false,
          },
          day: {
            id: nanoid(),
            time: "",
            medicineDose: "",
            isPlanned: false,
            isCompleted: false,
            isOverdue: false,
            isFailed: false,
          },
          evening: {
            id: nanoid(),
            time: "",
            medicineDose: "",
            isPlanned: false,
            isCompleted: false,
            isOverdue: false,
            isFailed: false,
          },
          night: {
            id: nanoid(),
            time: "",
            medicineDose: "",
            isPlanned: false,
            isCompleted: false,
            isOverdue: false,
            isFailed: false,
          },
        },
      ],
    },
  ]);
}

export function handleRemoveMedicineItem(setMedicineListItem) {
  setMedicineListItem((prevValue) => {
    const newArr = [...prevValue]
    newArr.pop()
    return newArr;
  });
}

export const handleMedicineMethodChange = (
  e,
  medicineId,
  field,
  setMedicineListItem
) => {
  const { value } = e.target;

  setMedicineListItem((prevList) =>
    prevList.map((medicine) =>
      medicine.id === medicineId ? { ...medicine, [field]: value } : medicine
    )
  );
};

export const handleItemChange = (
  e,
  medicineId,
  setMedicineListItem,
  isEmpty,
  searchMedicine,
  setSearchedMedicine
) => {
  const { name, value } = e.target;

  if (!isEmpty(value)) {
    searchMedicine(value.trim()).then((searchedMedicine) => {
      setSearchedMedicine((prevValues) => {
        return [...searchedMedicine];
      });
    });
  } else {
    setSearchedMedicine([{ id: 0, name: "" }]);
  }

  setMedicineListItem((prevList) =>
    prevList.map((medicine) =>
      medicine.id === medicineId ? { ...medicine, [name]: value } : medicine
    )
  );
};

export const handleDetailChange = (
  e,
  medicineId,
  detailsId,
  period,
  field,
  setMedicineListItem
) => {
  const { type, checked, value } = e.target;
  const newValue = type === "checkbox" ? checked : value;

  setMedicineListItem((prevList) =>
    prevList.map((medicine) =>
      medicine.id === medicineId
        ? {
            ...medicine,
            medicineDetails: medicine.medicineDetails.map((detail) =>
              detail.id === detailsId
                ? {
                    ...detail,
                    [period]: {
                      ...detail[period],
                      [field]: newValue,
                    },
                  }
                : detail
            ),
          }
        : medicine
    )
  );
};

export async function handleSubmit(
  e,
  setMedicineList,
  setTriggerSubmit,
  medicineDetails
) {
  e.preventDefault();
  setMedicineList((prevValue) => ({
    ...prevValue,
    medicineDetails: medicineDetails,
  }));
  setTriggerSubmit(true);
}

export function handleSearchedMedicineClick(
  e,
  medicineId,
  medicineName,
  setMedicineListItem,
  setShowSuggestions,
  setTriggerSearchedMedicine
) {
  setMedicineListItem((prevList) =>
    prevList.map((medicine) =>
      medicine.id === medicineId
        ? { ...medicine, medicineName: medicineName }
        : medicine
    )
  );
  setShowSuggestions(false);
  setTriggerSearchedMedicine(false);
}

export function handleCurrentRowClick(
  e,
  index,
  medicineName,
  setSearchedMedicine,
  setCurrentRowSuggestionIndex,
  setMedicineName,
  setTriggerSearchedMedicine
) {
  if (isEmpty(medicineName)) {
    setSearchedMedicine([]);
  }
  setCurrentRowSuggestionIndex(index);
  setMedicineName(medicineName);
  setTriggerSearchedMedicine(true);
}

export function getWeekDates(date) {
  let dates = [];
  let today = "";
  if (date) {
    today = date;
  } else {
    today = new Date();
  }

  for (let i = 0; i < 7; i++) {
    let nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push(nextDate.toISOString().split("T")[0]);
  }

  return dates;
}

export function formatDate(list) {
  return new Date(
    list.medicineListCreationDate[0],
    list.medicineListCreationDate[1] - 1,
    list.medicineListCreationDate[2],
    list.medicineListCreationDate[3],
    list.medicineListCreationDate[4],
    list.medicineListCreationDate[5],
    Math.floor(list.medicineListCreationDate[6] / 1_000_000)
  );
}

export function isEmpty(str) {
  return str === null || str.match(/^ *$/) !== null;
}
