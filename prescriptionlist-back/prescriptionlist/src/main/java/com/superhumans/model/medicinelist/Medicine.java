package com.superhumans.model.medicinelist;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * Клас {@code Medicine} представляє медикамент з унікальним ідентифікатором та назвою.
 */
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Medicine {

    /**
     * Унікальний ідентифікатор медикаменту.
     */
    Integer id;

    /**
     * Назва медикаменту.
     */
    String name;
}
