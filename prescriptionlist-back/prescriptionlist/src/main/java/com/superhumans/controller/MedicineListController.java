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

/**
 * Контролер для керування списками ліків.
 * Надає REST API для створення, оновлення, видалення та пошуку документів зі списками ліків, а також пацієнтів.
 */
@RestController
@RequestMapping("/api/medicinelist")
@CrossOrigin(origins = {"http://localhost:5173", "http://192.168.24.32:5173"}, allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.GET})
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MedicineListController {

    /**
     * Сервіс для обробки логіки, пов’язаної зі списками ліків.
     */
    MedicineService medicineService;

    /**
     * Отримує всі списки ліків.
     *
     * @return список {@link MedicineList}
     */
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<MedicineList> getAllMedicineLists() {
        return medicineService.getAllMedicineLists();
    }

    /**
     * Отримує список ліків за його ID.
     *
     * @param id ідентифікатор списку
     * @return {@link MedicineList}
     */
    @GetMapping("/bylist/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MedicineList getMedicineListById(@PathVariable("id") Integer id) {
        if (id != null)
            return medicineService.getMedicineListById(id);
        throw new AppException("Документу з " + id + " не знайдено", HttpStatus.NOT_FOUND);
    }

    /**
     * Отримує всі документи пацієнта за його ID.
     *
     * @param id ідентифікатор пацієнта
     * @return список {@link MedicineList}
     */
    @GetMapping("/bypatient/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<MedicineList> getAllDocumentsByPatientId(@PathVariable("id") Integer id) {
        if (id != null)
            return medicineService.getAllDocumentsByPatientId(id);
        throw new AppException("Пацієнт з " + id + " немає документів", HttpStatus.NOT_FOUND);
    }

    /**
     * Створює новий список ліків.
     *
     * @param medicineList об'єкт {@link MedicineList}
     */
    @SneakyThrows
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createNewMedicineList(@RequestBody MedicineList medicineList) {
        medicineService.createNewMedicineList(medicineList);
    }

    /**
     * Оновлює існуючий список ліків.
     *
     * @param medicineList об'єкт {@link MedicineList}
     */
    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public void updateMedicineList(@RequestBody MedicineList medicineList) {
        medicineService.updateMedicineListById(medicineList);
    }

    /**
     * Оновлює статус списку ліків за його ID.
     * Статус у контексті чи редагується на даний момент користувачем
     * @param id     ідентифікатор списку
     * @param status новий статус
     */
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updateMedicineListStatusByListId(@PathVariable Integer id, @RequestParam String status) {
        medicineService.updateMedicineListStatusByListId(id, status);
    }

    /**
     * Видаляє список ліків за ID.
     *
     * @param id ідентифікатор списку
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteMedicineListById(@PathVariable Integer id) {
        if (id != null)
            medicineService.deleteMedicineListById(id);
        throw new AppException("Документу з " + id + " не знайдено", HttpStatus.NOT_FOUND);
    }

    /**
     * Шукає пацієнтів за ключовим словом.
     *
     * @param keyword ключове слово пошуку
     * @return список {@link Patient}
     */
    @GetMapping("/searchpatients")
    @ResponseStatus(HttpStatus.OK)
    public List<Patient> searchPatients(@RequestParam String keyword) {
        return medicineService.searchPatients(keyword);
    }

    /**
     * Шукає ліки за ключовим словом.
     *
     * @param keyword ключове слово пошуку
     * @return список {@link Medicine}
     */
    @GetMapping("/searchmedicine")
    @ResponseStatus(HttpStatus.OK)
    public List<Medicine> searchMedicine(@RequestParam String keyword) {
        return medicineService.searchMedicine(keyword);
    }

    /**
     * Отримує пацієнта за ID.
     *
     * @param id ідентифікатор пацієнта
     * @return {@link Patient}
     */
    @GetMapping("/patient/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Patient getPatientById(@PathVariable("id") Integer id) {
        if (id != null)
            return medicineService.getPatientById(id);
        throw new AppException("Пацієнта з " + id + " не знайдено", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/patient")
    @ResponseStatus(HttpStatus.OK)
    public List<Patient> getAllInpatients() {
        System.out.println("Alarm");
        return medicineService.getAllInpatients();
    }

    /**
     * Перевіряє, чи документ редагується зараз.
     *
     * @param id ідентифікатор документа
     * @return true, якщо редагується, інакше false
     */
    @GetMapping("/isDocumentEditing/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean isDocumentEditing(@PathVariable("id") Integer id) {
        if (id != null)
            return medicineService.isDocumentEditing(id);
        throw new AppException("Документу з " + id + " не знайдено", HttpStatus.NOT_FOUND);
    }



}
