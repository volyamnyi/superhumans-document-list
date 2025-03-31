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
public class MedicineList {

    Integer medicineListID;
	Integer patientRef;
    String documentName;
	String medicineListCreationUser;
    LocalDateTime medicineListCreationDate;

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
