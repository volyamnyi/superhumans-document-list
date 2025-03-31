package com.superhumans.model.patient;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Patient {
    Integer id;
    String name;
    String historyNumber;
    String Address;
    String phone;
    String department;
    String roomNumber;
    String bedNumber;
    String gender;
    String age;
    String birthDate;
    String doctor;

    public void setGender(String gender) {
        this.gender = gender.equals("MAL") ? "Чоловіча" : "Жіноча";
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate.split(" ")[0];
    }
}
