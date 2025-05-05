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
 * Клас {@code MedicineDetails} представляє детальну інформацію про призначення медикаменту,
 * включаючи метод прийому, користувача, який редагував призначення, дату редагування, статус і розклад по днях.
 */
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MedicineDetails {

    /**
     * Унікальний ідентифікатор елемента призначення медикаменту.
     */
    @JsonProperty("id")
    String medicineListItemId;

    /**
     * Ім’я користувача, який востаннє редагував призначення.
     */
    String medicineListItemEditUser;

    /**
     * Метод застосування медикаменту (наприклад: перорально, внутрішньовенно).
     */
    String medicineMethod;

    /**
     * Назва медикаменту.
     */
    String medicineName;

    /**
     * Дата та час останнього редагування призначення.
     */
    LocalDateTime medicineListItemEditDate;

    /**
     * Детальний розклад призначення по днях.
     */
    List<Day> medicineDetails;

    /**
     * Поточний статус призначення медикаменту.
     */
    String status;

    @Override
    public String toString() {
        return "MedicineDetails{" +
                "medicineListItemId=" + medicineListItemId +
                ", medicineListItemEditUser='" + medicineListItemEditUser + '\'' +
                ", medicineListItemMethod='" + medicineMethod + '\'' +
                ", medicineListItemName='" + medicineName + '\'' +
                ", medicineListItemEditDate=" + medicineListItemEditDate +
                ", medicineDetails=" + medicineDetails +
                ", status=" + status +
                '}';
    }
}
