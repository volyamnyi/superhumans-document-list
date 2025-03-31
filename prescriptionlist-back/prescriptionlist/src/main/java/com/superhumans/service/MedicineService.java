package com.superhumans.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.superhumans.model.medicinelist.Medicine;
import com.superhumans.model.medicinelist.MedicineList;
import com.superhumans.model.patient.Patient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MedicineService {
    void createNewMedicineList(MedicineList medicineList) throws JsonProcessingException;

    List<MedicineList> getAllMedicineLists();
    List<MedicineList> getAllDocumentsByPatientId(Integer id);

    MedicineList getMedicineListById(Integer id);

    void updateMedicineListById(MedicineList medicineList);

    List<Patient> searchPatients(String keyword);

    Patient getPatientById(Integer id);


    List<Medicine> searchMedicine(String keyword);

    void deleteMedicineListById(Integer id);

    void updateMedicineListStatusByListId(Integer id, String status);

    Boolean isDocumentEditing(Integer id);
}
