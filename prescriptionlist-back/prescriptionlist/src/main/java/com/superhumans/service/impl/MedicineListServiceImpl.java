package com.superhumans.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.superhumans.model.medicinelist.Medicine;
import com.superhumans.model.medicinelist.MedicineList;
import com.superhumans.model.patient.Patient;
import com.superhumans.repository.MedicineListRepository;
import com.superhumans.service.MedicineService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MedicineListServiceImpl implements MedicineService {

    MedicineListRepository medicineListRepository;
    ObjectMapper objectMapper;


    @Override
    public List<MedicineList> getAllMedicineLists() {
        return medicineListRepository.getAllMedicineLists();
    }

    @Override
    public MedicineList getMedicineListById(Integer id) {
        return medicineListRepository.getMedicineListById(id);
    }

    @Override
    public List<MedicineList> getAllDocumentsByPatientId(Integer id) {
        return medicineListRepository.getAllDocumentsByPatientId(id);
    }

    @SneakyThrows
    @Override
    public void updateMedicineListById(MedicineList medicineList) {
        ObjectWriter objectWriter = objectMapper.writer().withDefaultPrettyPrinter();
        String json = objectWriter.writeValueAsString(medicineList.getMedicineDetails());
        medicineListRepository.updateMedicineListById(medicineList, json);
    }

    @SneakyThrows
    @Override
    public void createNewMedicineList(MedicineList medicineList) {
        ObjectWriter objectWriter = objectMapper.writer().withDefaultPrettyPrinter();
        System.out.println(medicineList.getMedicineDetails());
        String json = objectWriter.writeValueAsString(medicineList.getMedicineDetails());
        medicineListRepository.createNewMedicineList(medicineList, json);
    }

    @Override
    public List<Patient> searchPatients(String keyword) {
        return medicineListRepository.searchPatients(keyword);
    }

    @Override
    public Patient getPatientById(Integer id) {
        return medicineListRepository.getPatientById(id);
    }

    @Override
    public List<Medicine> searchMedicine(String keyword) {
        return medicineListRepository.searchMedicine(keyword);
    }

    @Override
    public void deleteMedicineListById(Integer id) {
        medicineListRepository.deleteMedicineListById(id);
    }

    @Override
    public void updateMedicineListStatusByListId(Integer id, String status) {
        medicineListRepository.updateMedicineListStatusByListId(id, status);
    }

    @Override
    public Boolean isDocumentEditing(Integer id) {
        return medicineListRepository.isDocumentEditing(id);
    }

    @Override
    public List<Patient> getAllInpatients() {
        return medicineListRepository.getAllInpatients();
    }

}
