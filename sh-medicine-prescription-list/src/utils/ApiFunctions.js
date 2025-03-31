import axios from "axios";
import { isTokenExpired } from "./Functions";
export const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (config.url === '/api/auth/login') {
      return config;
    }
    
    if (!token) {
      window.location.href = '/login';
      return Promise.reject(new Error('No token found'));
    }

    if (isTokenExpired(token)) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return Promise.reject(new Error('Token expired'));
    }
    //config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);


export const getHeader = () => {
  const token = localStorage.getItem("accessToken");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

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

export async function addNewMedicineList(medicineList) {
  try {
    const response = await api.post("/api/medicinelist", medicineList, {
      headers: getHeader(),
    });
    return response;
  } catch (error) {
    throw new Error(`Error creating medicine list ${error.message}`);
  }
}

export async function updateMedicineListById(medicineList) {
  try {
    const response = await api.put("/api/medicinelist", medicineList, {
      headers: getHeader(),
    });
    return response;
  } catch (error) {
    throw new Error(`Error updating medicine list ${error.message}`);
  }
}

export async function isDocumentEditing(listId) {
  try {
    const response = await api.get(`/api/medicinelist/isDocumentEditing/${listId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    return error
  }
}

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

export async function userLogin(login) {
  try {
    const response = await api.post("/api/auth/login", login, {});
    return response;
  } catch (error) {
    return error.response.data;
  }
}

export async function userRegister(registration) {
  try {
    const response = await api.post("/api/auth/register", registration);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`User registration error : ${error.message}`);
    }
  }
}
