package com.superhumans.model.medicinelist;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Клас {@code MedicineList} представляє призначення медикаментів для певного пацієнта.
 * Містить інформацію про автора, дату створення документа, та список деталей призначень.
 */
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MedicineList {

    /**
     * Унікальний ідентифікатор призначення медикаментів.
     */
    Integer medicineListID;

    /**
     * Ідентифікатор пацієнта, якому належить це призначення.
     */
	Integer patientRef;

    /**
     * Назва документа призначення.
     */
    String documentName;

    /**
     * Користувач, який створив документ призначення.
     */
	String medicineListCreationUser;

    /**
     * Дата та час створення/редагування документа призначення.
     */
    LocalDateTime medicineListCreationDate;

    /**
     * Список деталей призначення медикаментів (дозування, розклад, статус тощо).
     */
    @JsonProperty("medicineDetails")
    List<MedicineDetails> medicineDetails;

    @Override
    public String toString() {
        return "MedicineList{" +
                "medicineListID=" + medicineListID +
                ", patientRef=" + patientRef +
                ", documentName='" + documentName + '\'' +
                ", medicineListCreationUser='" + medicineListCreationUser + '\'' +
                ", medicineListCreationDate=" + medicineListCreationDate +
                ", medicineDetails=" + medicineDetails +
                '}';
    }
}
