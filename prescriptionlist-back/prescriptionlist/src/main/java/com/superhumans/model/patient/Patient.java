package com.superhumans.model.patient;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * Клас {@code Patient} представляє інформацію про пацієнта, включаючи особисті дані,
 * місце розташування у медичному закладі та контактну інформацію.
 */
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Patient {

    /**
     * Унікальний ідентифікатор пацієнта.
     */
    Integer id;

    /**
     * ПІБ пацієнта.
     */
    String name;

    /**
     * Номер історії хвороби.
     */
    String historyNumber;

    /**
     * Адреса проживання пацієнта.
     */
    String address;

    /**
     * Номер телефону пацієнта.
     */
    String phone;

    /**
     * Відділення, в якому перебуває пацієнт.
     */
    String department;

    /**
     * Номер палати.
     */
    String roomNumber;

    /**
     * Номер ліжка.
     */
    String bedNumber;

    /**
     * Стать пацієнта (у форматі "Чоловіча"/"Жіноча").
     */
    String gender;

    /**
     * Вік пацієнта.
     */
    String age;

    /**
     * Дата народження (у форматі yyyy-MM-dd).
     */
    String birthDate;

    /**
     * Лікар, відповідальний за пацієнта.
     */
    String doctor;

    /**
     * Встановлює стать пацієнта у зручному форматі.
     *
     * @param gender код статі ("MAL" або інше значення для "Жіноча")
     */
    public void setGender(String gender) {
        this.gender = gender.equals("MAL") ? "Чоловіча" : "Жіноча";
    }

    /**
     * Обрізає час з дати народження, залишаючи лише дату.
     *
     * @param birthDate дата народження у форматі "yyyy-MM-dd HH:mm:ss"
     */
    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate.split(" ")[0];
    }

    @Override
    public String toString() {
        return "Patient{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", historyNumber='" + historyNumber + '\'' +
                ", address='" + address + '\'' +
                ", phone='" + phone + '\'' +
                ", department='" + department + '\'' +
                ", roomNumber='" + roomNumber + '\'' +
                ", bedNumber='" + bedNumber + '\'' +
                ", gender='" + gender + '\'' +
                ", age='" + age + '\'' +
                ", birthDate='" + birthDate + '\'' +
                ", doctor='" + doctor + '\'' +
                '}';
    }
}
