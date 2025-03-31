package com.superhumans.model.medicinelist;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MedicineDetails {

    @JsonProperty("id")
    String medicineListItemId;

    //Integer medicineListRef;
    String medicineListItemEditUser;
    String medicineMethod;
    String medicineName;
    LocalDateTime medicineListItemEditDate;
    List<Day> medicineDetails;
    String Status;

    @Override
    public String toString() {
        return "MedicineDetails{" +
                "medicineListItemId=" + medicineListItemId +
                //", medicineListRef=" + medicineListRef +
                ", medicineListItemEditUser='" + medicineListItemEditUser + '\'' +
                ", medicineListItemMethod='" + medicineMethod + '\'' +
                ", medicineListItemName='" + medicineName + '\'' +
                ", medicineListItemEditDate=" + medicineListItemEditDate +
                ", medicineDetails=" + medicineDetails +
                '}';
    }
}
