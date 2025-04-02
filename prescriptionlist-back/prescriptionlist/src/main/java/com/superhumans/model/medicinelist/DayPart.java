package com.superhumans.model.medicinelist;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

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
