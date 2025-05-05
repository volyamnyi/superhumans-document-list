package com.superhumans.model.medicinelist;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * Клас {@code Day} представляє день з поділом на частини доби для прийому ліків.
 * Містить інформацію про дату та об'єкти {@link DayPart} для кожної частини дня:
 * ранок, день, вечір і ніч.
 */
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Day {

    /**
     * Унікальний ідентифікатор дня.
     */
    String id;

    /**
     * Дата у форматі рядка (наприклад, yyyy-MM-dd).
     */
    String date;

    /**
     * Частина дня — ранок. Містить інформацію про дозування та статуси прийому.
     */
    @JsonProperty("morning")
    DayPart morning;

    /**
     * Частина дня — день. Містить інформацію про дозування та статуси прийому.
     */
    @JsonProperty("day")
    DayPart day;

    /**
     * Частина дня — вечір. Містить інформацію про дозування та статуси прийому.
     */
    @JsonProperty("evening")
    DayPart evening;

    /**
     * Частина дня — ніч. Містить інформацію про дозування та статуси прийому.
     */
    @JsonProperty("night")
    DayPart night;

    /**
     * Повертає строкове представлення об'єкта {@code Day}.
     *
     * @return Інформація про день та всі його частини у зручному вигляді
     */
    @Override
    public String toString() {
        return "Day{" +
                "id=" + id +
                ", date=" + date +
                ", morning=" + morning +
                ", day=" + day +
                ", evening=" + evening +
                ", night=" + night +
                '}';
    }
}
