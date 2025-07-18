package com.superhumans.model.medicinelist;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * Клас {@code DayPart} представляє частину доби для прийому ліків.
 * Містить інформацію про час, дозування, а також статуси виконання плану прийому.
 */
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DayPart {

    /**
     * Унікальний ідентифікатор частини дня.
     */
    String id;
    //LocalTime time;

    /**
     * Час прийому ліків у форматі {@code String}.
     * Може бути у вигляді HH:mm або іншим зручним для фронтенду способом.
     */
    String time;

    /**
     * Доза ліків, яку потрібно прийняти у цій частині дня.
     */
    String medicineDose;

    /**
     * Прапорець, який вказує, чи заплановано цей прийом.
     */
    Boolean isPlanned;
    Boolean isPlannedAndFinished;

    /**
     * Прапорець, який вказує, чи був цей прийом виконаний.
     */
    Boolean isCompleted;
    Boolean isCompletedAndFinished;

    /**
     * Прапорець, який вказує, чи прострочений цей прийом.
     */
    Boolean isOverdue;

    /**
     * Прапорець, який вказує, чи прийом вважається невдалим.
     */
    Boolean isFailed;

    @Override
    public String toString() {
        return "DayPart{" +
                "id=" + id +
                ", time=" + time +
                ", isPlanned=" + isPlanned +
                ", isCompleted=" + isCompleted +
                ", isOverdue=" + isOverdue +
                ", isFailed=" + isFailed +
                '}';
    }
}
