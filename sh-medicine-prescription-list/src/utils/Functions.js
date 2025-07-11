import { nanoid } from "nanoid";
import { jwtDecode } from "jwt-decode";

/**
 * Перевіряє, чи протермінований JWT токен
 * @param {*} token JWT-токен
 * @returns {boolean} true, якщо токен протермінований або некоректний
 */

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

/**
 * Додає новий день з деталями прийому ліків
 * @param {*} medicineDetails Масив об’єктів ліків
 * @param {*} rowIndex Індекс рядка в масиві
 * @param {*} colIndex Індекс дати у списку дат
 * @param {*} setMedicineListItem Функція оновлення стану
 * @param {*} dates Масив дат
 */

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

export function fillAll(row, setMedicineListItem, dates) {}

export function handleAddNewDayDetails2(
  medicineDetails,
  rowIndex,
  colIndex,
  setMedicineListItem,
  dates
) {
  //const daysCount = prompt("Введіть скільки днів додати:");
  setTimeout(() => {
    for (let k = 1; k < dates.length; k++)
      medicineDetails[rowIndex]?.medicineDetails?.push({
        id: nanoid(),
        date: dates[k],
        morning: {
          id: nanoid(),
          time: "",
          medicineDose:
            medicineDetails[rowIndex]?.medicineDetails[0].morning.medicineDose,
          isPlanned: medicineDetails[rowIndex]?.medicineDetails[0].morning
            .isPlanned
            ? true
            : false,
          isCompleted: false,
          isOverdue: false,
          isFailed: false,
        },
        day: {
          id: nanoid(),
          time: "",
          medicineDose:
            medicineDetails[rowIndex]?.medicineDetails[0].day.medicineDose,
          isPlanned: medicineDetails[rowIndex]?.medicineDetails[0].day.isPlanned
            ? true
            : false,
          isCompleted: false,
          isOverdue: false,
          isFailed: false,
        },
        evening: {
          id: nanoid(),
          time: "",
          medicineDose:
            medicineDetails[rowIndex]?.medicineDetails[0].evening.medicineDose,
          isPlanned: medicineDetails[rowIndex]?.medicineDetails[0].evening
            .isPlanned
            ? true
            : false,
          isCompleted: false,
          isOverdue: false,
          isFailed: false,
        },
        night: {
          id: nanoid(),
          time: "",
          medicineDose:
            medicineDetails[rowIndex]?.medicineDetails[0].night.medicineDose,
          isPlanned: medicineDetails[rowIndex]?.medicineDetails[0].night
            .isPlanned
            ? true
            : false,
          isCompleted: false,
          isOverdue: false,
          isFailed: false,
        },
      });

    setMedicineListItem([...medicineDetails]);
  }, 500);
}

export function handleAddNewDayDetails4(
  medicineDetails,
  rowIndex,
  setMedicineListItem,
  dates
) {
  setTimeout(() => {
    const dayDetails = medicineDetails[rowIndex]?.medicineDetails;

    //if (!dayDetails || !Array.isArray(dayDetails)) return;

    const reference = dayDetails[0];

    for (let k = 1; k < dates.length; k++) {
      const existingDay = dayDetails[k];
      if (existingDay) {
        existingDay.date = dates[k];

        existingDay.morning = {
          ...existingDay.morning,
          id: nanoid(),
          time: "",
          medicineDose: reference.morning.medicineDose,
          isPlanned: !!reference.morning.isPlanned,
          isCompleted: false,
          isOverdue: false,
          isFailed: false,
        };

        existingDay.day = {
          ...existingDay.day,
          id: nanoid(),
          time: "",
          medicineDose: reference.day.medicineDose,
          isPlanned: !!reference.day.isPlanned,
          isCompleted: false,
          isOverdue: false,
          isFailed: false,
        };

        existingDay.evening = {
          ...existingDay.evening,
          id: nanoid(),
          time: "",
          medicineDose: reference.evening.medicineDose,
          isPlanned: !!reference.evening.isPlanned,
          isCompleted: false,
          isOverdue: false,
          isFailed: false,
        };

        existingDay.night = {
          ...existingDay.night,
          id: nanoid(),
          time: "",
          medicineDose: reference.night.medicineDose,
          isPlanned: !!reference.night.isPlanned,
          isCompleted: false,
          isOverdue: false,
          isFailed: false,
        };
      }
    }

    setMedicineListItem([...medicineDetails]);
  }, 500);
}

export function handleAddNewDayDetails3(
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

/**
 * Видаляє останній запис дня з деталей прийому ліків
 * @param {*} medicineDetails Масив об’єктів ліків
 * @param {*} rowIndex Індекс рядка
 * @param {*} colIndex Індекс дати (не використовується)
 * @param {*} setMedicineListItem Функція оновлення стану
 */

export function handleDelNewDayDetails(
  medicineDetails,
  rowIndex,
  colIndex,
  setMedicineListItem
) {
  medicineDetails[rowIndex]?.medicineDetails?.pop();
  setMedicineListItem([...medicineDetails]);
}

export function handleDelNewDayDetails2(
  medicineDetails,
  rowIndex,
  colIndex,
  setMedicineListItem
) {
  /*if (medicineDetails[rowIndex]) {
    medicineDetails[rowIndex].medicineDetails = [
      medicineDetails[rowIndex].medicineDetails[0],
    ];
  }*/
  let daysCount = prompt("Введіть скільки днів видалити:");
  daysCount = daysCount - 1 >= colIndex ? (daysCount = colIndex) : daysCount;

  for (let i = 0; i < daysCount; i++)
    medicineDetails[rowIndex]?.medicineDetails?.pop();
  setMedicineListItem([...medicineDetails]);
}

/**
 * Додає новий елемент ліків із початковими значеннями
 * @param {*} medicineList Об’єкт із даними про користувача
 * @param {*} setMedicineListItem Функція оновлення стану
 * @param {*} dates Масив дат
 */

export function handleAddNewMedicineItem(
  medicineList,
  setMedicineListItem,
  dates,
  setShowRegime
) {
  setShowRegime(true);
  setMedicineListItem((prevValue) => [
    ...prevValue,
    {
      id: nanoid(),
      medicineListItemEditUser: medicineList.medicineListCreationUser,
      medicineListItemEditDate: new Date(),
      medicineName: "",
      regime: "Режим: ",
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

export function refreshDates(medicineList, setMedicineListItem, dates) {
  
  console.log(dates)
  const medicineDetails = medicineList.medicineDetails;
  medicineDetails.forEach((md1)=>md1.medicineDetails.forEach((md2,i)=>md2.date=dates[i]))
  medicineList.medicineDetails = medicineDetails;
  //console.log(medicineList.medicineDetails)
  setMedicineListItem(medicineDetails)
}

export function handleAddNewMedicineItem2(
  medicineList,
  setMedicineListItem,
  dates,
  setShowRegime,
  i
) {
  setShowRegime(true);
  const medicineDetails = [];

  for (let i = 0; i < dates.length; i++) {
    medicineDetails.push({
      id: nanoid(),
      date: dates[i],
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
  }
  setMedicineListItem((prevValue) => [
    ...prevValue,
    {
      id: nanoid(),
      medicineListItemEditUser: medicineList.medicineListCreationUser,
      medicineListItemEditDate: new Date(),
      medicineName: "",
      regime: "Режим: ",
      medicineMethod: "",
      medicineDetails: medicineDetails,
    },
  ]);
}

/**
 * Видаляє останній елемент із масиву ліків
 * @param {*} setMedicineListItem Функція оновлення стану
 */

/*export function handleRemoveMedicineItem(setMedicineListItem) {
  setMedicineListItem((prevValue) => {
    const newArr = [...prevValue];
    newArr.pop();
    return newArr;
  });
}*/

export function handleRemoveMedicineItem(setMedicineListItem, index) {
  setMedicineListItem((prevValue) => {
    const newArr = [...prevValue];

    if (index > -1) {
      // only splice array when item is found
      newArr.splice(index, 1); // 2nd parameter means remove one item only
    }
    return newArr;
  });
}

/**
 * Змінює метод вводу/прийому для конкретного елемента ліків
 * @param {*} e Подія зміни (input)
 * @param {*} medicineId ID елемента ліків
 * @param {*} field Поле для оновлення
 * @param {*} setMedicineListItem Функція оновлення стану
 */

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

export const handleMedicineRegimeChange = (e, field, setMedicineListItem) => {
  const { value } = e.target;

  setMedicineListItem((prevList) =>
    prevList.map((medicine) => {
      return { ...medicine, [field]: value };
    })
  );
};

/**
 * Обробляє зміну назви ліків і виконує пошук
 * @param {*} e Подія зміни
 * @param {*} medicineId ID елемента ліків
 * @param {*} setMedicineListItem Функція оновлення стану
 * @param {*} isEmpty Функція перевірки на порожність
 * @param {*} searchMedicine Функція для пошуку ліків
 * @param {*} setSearchedMedicine Функція оновлення результатів пошуку
 */

export const handleItemChange = (
  e,
  medicineId,
  setMedicineListItem,
  isEmpty,
  searchMedicine,
  setSearchedMedicine,
  textareaRef
) => {
  const { name, value } = e.target;
  const textarea = textareaRef.current;
  /*if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }*/

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

/**
 * Оновлює значення в певному періоді дня (ранок, день і т.д.) для конкретного дня
 * @param {*} e Подія зміни
 * @param {*} medicineId ID елемента ліків
 * @param {*} detailsId ID конкретного дня
 * @param {*} period Період дня ("morning", "day", "evening", "night")
 * @param {*} field Поле для оновлення
 * @param {*} setMedicineListItem Функція оновлення стану
 */

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

/**
 * Обробляє створення/збереження листка
 * @param {*} e Подія submit
 * @param {*} setMedicineList Функція оновлення списку ліків
 * @param {*} setTriggerSubmit Функція встановлення прапорця підтвердження
 * @param {*} medicineDetails Дані з деталями ліків
 */

export async function handleSubmit(
  e,
  setMedicineList,
  setTriggerSubmit,
  medicineDetails,
  isNew,
  redirectUrl,
  navigate
) {
  e.preventDefault();
  setMedicineList((prevValue) => ({
    ...prevValue,
    medicineDetails: medicineDetails,
  }));
  setTriggerSubmit(true);

  setTimeout(() => {
    isNew && navigate && redirectUrl && navigate(redirectUrl);
  }, 1000);
}

/**
 * Обробляє вибір ліків зі списку пошуку/підказок
 * @param {*} e Подія кліку
 * @param {*} medicineId ID елемента ліків
 * @param {*} medicineName Назва обраного ліки
 * @param {*} setMedicineListItem Функція оновлення стану
 * @param {*} setShowSuggestions Приховує підказки
 * @param {*} setTriggerSearchedMedicine Вимикає прапорець пошуку
 */

export function handleSearchedMedicineClick(
  e,
  medicineId,
  medicineName,
  setMedicineListItem,
  setShowSuggestions,
  setTriggerSearchedMedicine,
  textareaRef
) {
  /*setTimeout(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, "100");*/

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

/**
 * Обробляє клік по поточному рядку автозаповнення
 * @param {*} e Подія кліку
 * @param {*} index Індекс рядка
 * @param {*} medicineName Назва ліків
 * @param {*} setSearchedMedicine Очищає або оновлює список пошуку
 * @param {*} setCurrentRowSuggestionIndex Встановлює поточний рядок
 * @param {*} setMedicineName Встановлює назву ліків
 * @param {*} setTriggerSearchedMedicine Активує пошук
 */

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

/**
 * Генерує масив з 7 дат, починаючи з сьогоднішньої або заданої
 * @param {*} date Початкова дата (необов’язково)
 * @returns {string[]} Масив дат у форматі yyyy-mm-dd
 */

export function getWeekDates(date, daysCount) {
  let dates = [];
  let today = "";
  if (date) {
    today = date;
  } else {
    today = new Date();
  }

  for (let i = 0; i < daysCount; i++) {
    let nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push(nextDate.toISOString().split("T")[0]);
  }

  return dates;
}

export function getCustomWeekDates(date, daysCount) {
  let dates = [];
  let today = "";
  if (date) {
    today = date;
  } else {
    today = new Date();
  }

  for (let i = 0; i < daysCount; i++) {
    let nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push(nextDate.toISOString().split("T")[0]);
  }

  return dates;
}

/**
 * Конвертує масив із значеннями дати в об'єкт Date
 * @param {*} list Масив [рік, місяць, день, година, хвилина, секунда, наносекунди]
 * @returns {Date} Об’єкт дати
 */

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

export function formatDate2(list) {
  if (list)
    return new Date(
      list[0],
      list[1] - 1,
      list[2],
      list[3],
      list[4],
      list[5],
      Math.floor(list[6] / 1_000_000)
    );
}

export function formatDateToISO(date) {
  return date.toISOString().split("T")[0];
}

export function isoToTimestampSeconds(isoString) {
  return Math.floor(new Date(isoString).getTime() / 1000);
}

export function isLessThanOneHour(timestampInSeconds) {
  const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
  const differenceInSeconds = currentTimestampInSeconds - timestampInSeconds;
  return differenceInSeconds < 3600; // 3600 seconds = 1 hour
}

/**
 * Перевіряє, чи строка є порожньою або складається лише з пробілів
 * @param {*} str Вхідна строка
 * @returns {boolean} true, якщо строка порожня
 */

export function isEmpty(str) {
  return str === null || str.match(/^ *$/) !== null;
}

export function autoPlan() {}
