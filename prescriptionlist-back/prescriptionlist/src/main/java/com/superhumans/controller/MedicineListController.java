package com.superhumans.controller;

import com.superhumans.exception.AppException;
import com.superhumans.model.medicinelist.Medicine;
import com.superhumans.model.medicinelist.MedicineList;
import com.superhumans.model.patient.Patient;
import com.superhumans.service.MedicineService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicinelist")
@CrossOrigin(origins = {"http://localhost:5173", "http://192.168.24.32:5173"}, allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.GET})
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MedicineListController {

    MedicineService medicineService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<MedicineList> getAllMedicineLists() {
        return medicineService.getAllMedicineLists();
    }

    @GetMapping("/bylist/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MedicineList getMedicineListById(@PathVariable("id") Integer id) {
        if (id != null)
            return medicineService.getMedicineListById(id);
        throw new AppException("Документу з " + id + " не знайдено", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/bypatient/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<MedicineList> getAllDocumentsByPatientId(@PathVariable("id") Integer id) {
        if (id != null)
            return medicineService.getAllDocumentsByPatientId(id);
        throw new AppException("Пацієнт з " + id + " немає документів", HttpStatus.NOT_FOUND);
    }

    @SneakyThrows
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createNewMedicineList(@RequestBody MedicineList medicineList) {
        medicineService.createNewMedicineList(medicineList);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public void updateMedicineList(@RequestBody MedicineList medicineList) {
        medicineService.updateMedicineListById(medicineList);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updateMedicineListStatusByListId(@PathVariable Integer id, @RequestParam String status) {
       /* System.out.println("ID: " + id);
        System.out.println("Status: " + status);
        if (id == null || status == null)
            throw new AppException("Документу з " + id + " не знайдено", HttpStatus.NOT_FOUND);*/
        medicineService.updateMedicineListStatusByListId(id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteMedicineListById(@PathVariable Integer id) {
        if (id != null)
            medicineService.deleteMedicineListById(id);
        throw new AppException("Документу з " + id + " не знайдено", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/searchpatients")
    @ResponseStatus(HttpStatus.OK)
    public List<Patient> searchPatients(@RequestParam String keyword) {
        return medicineService.searchPatients(keyword);
    }

    @GetMapping("/searchmedicine")
    @ResponseStatus(HttpStatus.OK)
    public List<Medicine> searchMedicine(@RequestParam String keyword) {
        return medicineService.searchMedicine(keyword);
    }


    @GetMapping("/patient/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Patient getPatientById(@PathVariable("id") Integer id) {
        if (id != null)
            return medicineService.getPatientById(id);
        throw new AppException("Пацієнта з " + id + " не знайдено", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/isDocumentEditing/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean isDocumentEditing(@PathVariable("id") Integer id) {
        if (id != null)
            return medicineService.isDocumentEditing(id);
        throw new AppException("Документу з " + id + " не знайдено", HttpStatus.NOT_FOUND);
    }

}
