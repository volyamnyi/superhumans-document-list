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

export function handleAddNewDayDetails2(
  medicineDetails,
  rowIndex,
  colIndex,
  setMedicineListItem,
  dates
) {
  for (let k = 0; k < 20; k++)
    medicineDetails[rowIndex]?.medicineDetails?.push({
      id: nanoid(),
      date: dates[colIndex],
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
        isPlanned: medicineDetails[rowIndex]?.medicineDetails[0].night.isPlanned
          ? true
          : false,
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
  if (medicineDetails[rowIndex]) {
    medicineDetails[rowIndex].medicineDetails = [
      medicineDetails[rowIndex].medicineDetails[0],
    ];
  }
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
  dates
) {
  setMedicineListItem((prevValue) => [
    ...prevValue,
    {
      id: nanoid(),
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

/**
 * Видаляє останній елемент із масиву ліків
 * @param {*} setMedicineListItem Функція оновлення стану
 */

export function handleRemoveMedicineItem(setMedicineListItem) {
  setMedicineListItem((prevValue) => {
    const newArr = [...prevValue];
    newArr.pop();
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
  medicineDetails
) {
  e.preventDefault();
  setMedicineList((prevValue) => ({
    ...prevValue,
    medicineDetails: medicineDetails,
  }));
  setTriggerSubmit(true);
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

export function getWeekDates(date) {
  let dates = [];
  let today = "";
  if (date) {
    today = date;
  } else {
    today = new Date();
  }

  for (let i = 0; i < 21; i++) {
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

/**
 * Перевіряє, чи строка є порожньою або складається лише з пробілів
 * @param {*} str Вхідна строка
 * @returns {boolean} true, якщо строка порожня
 */

export function isEmpty(str) {
  return str === null || str.match(/^ *$/) !== null;
}

export function autoPlan() {}
