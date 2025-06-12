import axios from "axios";
import { isTokenExpired } from "./Functions";

/**
 * Створення екземпляра Axios із базовим URL.
 * Цей інстанс використовується для всіх HTTP-запитів до бекенду.
 *
 * @param {*} baseURL Базова адреса сервера API
 */

export const api = axios.create({
  baseURL: "http://localhost:8080",
  //baseURL: "http://192.168.24.32:8080",
});

/**
 * Перехоплює кожен запит перед його відправкою.
 * Перевіряє наявність токена, його валідність,
 * та перенаправляє на сторінку логіну при необхідності.
 *
 * @param {*} config Конфігурація запиту Axios
 * @returns {*} Модифікована конфігурація запиту або помилка
 */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (config.url === "/api/auth/login") {
      return config;
    }

    if (!token) {
      window.location.href = "/login";
      return Promise.reject(new Error("No token found"));
    }

    if (isTokenExpired(token)) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(new Error("Token expired"));
    }
    //config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

/**
 * Формує заголовки для HTTP-запитів із JWT токеном.
 *
 * @returns {{ Authorization: string, "Content-Type": string }}
 * Об'єкт із заголовками авторизації та типом контенту
 */

export const getHeader = () => {
  const token = localStorage.getItem("accessToken");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

/**
 * API запит для отримання всіх медичних листів.
 *
 * @returns {Promise<any>} Список всіх медичних листів
 */

export async function getAllMedicineLists() {
  try {
    const response = await api.get(`/api/medicinelist`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching medicine lists");
  }
}

/**
 * Отримати всі документи за ID пацієнта.
 *
 * @param {number|string} patientId - ID пацієнта
 * @returns {Promise<any>} Документи пацієнта
 */

export async function getAllDocumentsByPatientId(patientId) {
  try {
    const response = await api.get(`/api/medicinelist/bypatient/${patientId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching medicine lists ${error.message}`);
  }
}

/**
 * Отримати медичний лист за його ID.
 *
 * @param {number|string} listId - ID листа
 * @returns {Promise<any>} Медичний лист
 */

export async function getMedicineListById(listId) {
  try {
    const response = await api.get(`/api/medicinelist/bylist/${listId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching medicine list ${error.message}`);
  }
}

/**
 * Видалити документ за його ID.
 *
 * @param {number|string} documentId - ID документа
 * @returns {Promise<any>} Відповідь сервера або повідомлення про помилку
 */

export async function deleteDocumentById(documentId) {
  try {
    const response = await api.delete(`/api/medicinelist/${documentId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
}

/**
 * Створити новий медичний лист.
 *
 * @param {Object} medicineList - Об'єкт медичного листа
 * @returns {Promise<any>} Відповідь сервера
 */

export async function addNewMedicineList(medicineList, patient) {
  const payload = {
    medicineList,
    patient: patient,
  };

  try {
    const response = await api.post("/api/medicinelist", payload, {
      headers: getHeader(),
    });
    return response;
  } catch (error) {
    throw new Error(`Error creating medicine list ${error.message}`);
  }
}

/**
 * Оновити медичний лист за його ID, котрий знаходиться у об'єкті
 *
 * @param {Object} medicineList - Дані оновленого листа
 * @returns {Promise<any>} Відповідь сервера
 */

export async function updateMedicineListById(medicineList, patient) {
  const payload = {
    medicineList,
    patient: patient,
  };

  try {
    const response = await api.put("/api/medicinelist", payload, {
      headers: getHeader(),
    });
    return response;
  } catch (error) {
    throw new Error(`Error updating medicine list ${error.message}`);
  }
}

/**
 * Перевірка, чи документ редагується іншим користувачем.
 *
 * @param {number|string} listId - ID документа
 * @returns {Promise<any>} Статус редагування
 */

export async function isDocumentEditing(listId) {
  try {
    const response = await api.get(
      `/api/medicinelist/isDocumentEditing/${listId}`,
      {
        headers: getHeader(),
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
}

/**
 * Оновити статус медичного листа за ID.
 *
 * @param {number|string} id - ID листа
 * @param {string} status - Новий статус
 * @returns {Promise<any>} Відповідь сервера
 */

export async function updateMedicineListStatusByListId(id, status) {
  try {
    const response = await api.put(
      `/api/medicinelist/${id}?status=${status}`,
      {},
      {
        headers: getHeader(),
      }
    );
    return response;
  } catch (error) {
    throw new Error(`Error updating medicine list status ${error.message}`);
  }
}

/**
 * Пошук пацієнтів за ключовим словом.
 *
 * @param {string} keyword - Ключове слово пошуку
 * @returns {Promise<any>} Список знайдених пацієнтів
 */

export async function searchPatients(keyword) {
  try {
    const response = await api.get(
      `/api/medicinelist/searchpatients?keyword=${keyword}`,
      {
        headers: getHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching patients");
  }
}

export async function getAllInpatients(order) {
  try {
    const response = await api.get(`/api/medicinelist/patient/sort/${order}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching patients");
  }
}

/**
 * Оновити дані користувача за його ID.
 *
 * @param {Object} user - Дані користувача
 * @returns {Promise<any>} Відповідь сервера
 */

export async function updateUserById(user) {
  try {
    const response = await api.put(`/api/auth/admin`, user, {
      headers: getHeader(),
    });
    return response;
  } catch (error) {
    throw new Error(`Error updating user${error.message}`);
  }
}

/**
 * Видалити користувача за його ID.
 *
 * @param {number|string} userId - ID користувача
 * @returns {Promise<any>} Відповідь або повідомлення про помилку
 */

export async function deleteUserById(userId) {
  try {
    const response = await api.delete(`/api/auth/admin/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
}

/**
 * Отримати список усіх користувачів.
 *
 * @returns {Promise<any>} Список користувачів
 */

export async function getAllUsers() {
  try {
    const response = await api.get("/api/auth/admin", {
      headers: getHeader(),
    });

    return response.data;
  } catch (error) {
    throw new Error(`Error fetching users ${error.message}`);
  }
}

/**
 * Пошук ліків за ключовим словом.
 *
 * @param {string} keyword - Ключове слово пошуку
 * @returns {Promise<any>} Список ліків
 */

export async function searchMedicine(keyword) {
  const encodedKeyword = encodeURIComponent(keyword);
  try {
    const response = await api.get(
      `/api/medicinelist/searchmedicine?keyword=${encodedKeyword}`,
      {
        headers: getHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching medicine");
  }
}

/**
 * Отримати пацієнта за його ID.
 *
 * @param {number|string} patientId - ID пацієнта
 * @returns {Promise<any>} Дані пацієнта
 */

export async function getPatientById(patientId) {
  try {
    const response = await api.get(`/api/medicinelist/patient/${patientId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching patients ${error.message}`);
  }
}

/**
 * Вхід користувача.
 *
 * @param {Object} login - Дані для входу
 * @returns {Promise<any>} Відповідь сервера або повідомлення про помилку
 */

export async function userLogin(login) {
  try {
    const response = await api.post("/api/auth/login", login, {});
    return response;
  } catch (error) {
    return error.response.data;
  }
}

/**
 * Реєстрація нового користувача.
 *
 * @param {Object} registration - Дані для реєстрації
 * @returns {Promise<any>} Відповідь сервера
 */

export async function userRegister(registration) {
  try {
    const response = await api.post("/api/auth/admin/register", registration, {
      headers: getHeader(),
    });

    return response.data;
  } catch (error) {
    throw new Error(`User registration error : ${error.message}`);
  }
}

export async function generateDEDoc(medicineListID, documentDateTime) {
  try {
    const response = await api.get(`/api/medicinelist/generatedoc?medicineListID=${medicineListID}&documentDateTime=${encodeURIComponent(documentDateTime)}`, {
      headers: getHeader(),
    });

    return response.data;
  } catch (error) {
    throw new Error(`Document generating error : ${error.message}`);
  }
}
