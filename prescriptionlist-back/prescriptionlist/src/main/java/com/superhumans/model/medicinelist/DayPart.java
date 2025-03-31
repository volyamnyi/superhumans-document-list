package com.superhumans.model.medicinelist;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DayPart {

    String id;
    //LocalTime time;
    String time;
    Integer medicineDose;
    Boolean isPlanned;
    Boolean isCompleted;
    Boolean isOverdue;
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
