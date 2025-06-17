package com.superhumans.repository;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.superhumans.exception.AppException;
import com.superhumans.model.medicinelist.Medicine;
import com.superhumans.model.medicinelist.MedicineDetails;
import com.superhumans.model.medicinelist.MedicineList;
import com.superhumans.model.patient.IdsAndDateTimes;
import com.superhumans.model.patient.Patient;
import com.superhumans.model.user.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Репозиторій для роботи з медичними списками у базі даних.
 * Це клас, який надає методи для створення, оновлення, пошуку та видалення медичних списків.
 */
@Repository
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MedicineListRepository {

    /**
     * Об'єкт для роботи з базою даних через JDBC.
     */
    JdbcTemplate jdbcTemplate;

    /**
     * Об'єкт для серіалізації та десеріалізації JSON.
     */
    ObjectMapper objectMapper;

    /**
     * Створює новий медичний список у базі даних.
     *
     * @param medicineList Об'єкт медичного списку.
     * @param json         Строка JSON, що містить деталі медичного списку.
     */
    public void createNewMedicineList(MedicineList medicineList, String json) {
        String sql = "INSERT INTO MedicineList (PatientRef, MedicineListCreationUser, MedicineListCreationDate, DocumentName) VALUES (?,?,?,?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        String finalSql = sql;
        jdbcTemplate.update(
                connection -> {
                    PreparedStatement ps = connection.prepareStatement(finalSql, Statement.RETURN_GENERATED_KEYS);
                    ps.setInt(1, medicineList.getPatientRef());
                    ps.setString(2, medicineList.getMedicineListCreationUser());
                    ps.setString(3, String.valueOf(medicineList.getMedicineListCreationDate()));
                    ps.setString(4, medicineList.getDocumentName());
                    return ps;
                },
                keyHolder
        );

        Integer medicineListId = ((BigDecimal) keyHolder.getKeyList().get(keyHolder.getKeyList().size() - 1).get("GENERATED_KEYS")).intValue();


        sql = "INSERT INTO MedicineListItem(MedicineListRef, MedicineListItemEditUser, MedicineListItemEditDate, MedicineDetails, Status) VALUES (?,?,?,?,?);";
        jdbcTemplate.update(
                sql,
                medicineListId,
                medicineList.getMedicineListCreationUser(),
                //String.valueOf(medicineList.getMedicineListCreationDate()),
                LocalDateTime.now(),
                json,
                "Saved"
        );
    }

    /**
     * Отримує всі медичні списки з бази даних.
     *
     * @return Список усіх медичних списків.
     */
    public List<MedicineList> getAllMedicineLists() {
        RowMapper<MedicineList> mapper = new RowMapper() {

            @Override
            @SneakyThrows
            public MedicineList mapRow(ResultSet rs, int rowNum) {
                MedicineList medicalList = new MedicineList();
                medicalList.setMedicineListID(rs.getObject("MedicineListID", Integer.class));
                medicalList.setPatientRef(rs.getObject("PatientRef", Integer.class));
                medicalList.setDocumentName(rs.getObject("DocumentName", String.class));
                medicalList.setMedicineListCreationUser(rs.getObject("MedicineListCreationUser", String.class));
                medicalList.setMedicineListCreationDate(rs.getObject("MedicineListCreationDate", LocalDateTime.class));
                return medicalList;
            }
        };
        return jdbcTemplate.query("SELECT MedicineListId, PatientRef, DocumentName, MedicineListCreationUser, MedicineListCreationDate FROM MedicineList", mapper);
    }

    /**
     * Отримує медичний список за його ідентифікатором.
     *
     * @param id Ідентифікатор медичного списку.
     * @return Об'єкт медичного списку.
     */
    public MedicineList getMedicineListById(Integer id) {
        RowMapper<MedicineList> mapper = new RowMapper() {

            @SneakyThrows
            @Override
            public MedicineList mapRow(ResultSet rs, int rowNum) {
                MedicineList medicalList = new MedicineList();
                medicalList.setMedicineListID(rs.getObject("MedicineListID", Integer.class));
                medicalList.setPatientRef(rs.getObject("PatientRef", Integer.class));
                medicalList.setDocumentName(rs.getObject("DocumentName", String.class));
                medicalList.setMedicineListCreationUser(rs.getObject("MedicineListCreationUser", String.class));
                medicalList.setMedicineListCreationDate(rs.getObject("MedicineListCreationDate", LocalDateTime.class));

                String json = rs.getString("MedicineDetails");
                List<MedicineDetails> medicineDetails = objectMapper.readValue(json, new TypeReference<>() {

                });
                medicalList.setMedicineDetails(medicineDetails);

                return medicalList;
            }
        };

        List<MedicineList> result = jdbcTemplate.query("SELECT * FROM MedicineList ml LEFT JOIN MedicineListItem mli ON ml.MedicineListID = mli.MedicineListRef WHERE ml.MedicineListID = ?;", mapper, id);

        return result.get(0);
    }

    /**
     * Оновлює медичний список за його ідентифікатором.
     *
     * @param medicineList Об'єкт медичного списку для оновлення.
     * @param json         Строка JSON, що містить оновлені деталі медичного списку.
     */
    public void updateMedicineListById(MedicineList medicineList, String json) {

        RowMapper<MedicineDetails> mapper = new RowMapper() {

            @SneakyThrows
            @Override
            public MedicineDetails mapRow(ResultSet rs, int rowNum) {
                MedicineDetails medicalListItem = new MedicineDetails();
                medicalListItem.setStatus(rs.getObject("Status", String.class));
                return medicalListItem;
            }
        };

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        List<MedicineDetails> result = jdbcTemplate.query("SELECT Status FROM MedicineListItem WHERE MedicineListRef = ?;", mapper, medicineList.getMedicineListID());
        if (result.get(0).getStatus().equals(getCurrentLogin()) || result.get(0).getStatus().equals("Saved")) {

            if (user.getBusinessRole().equals("DOCTOR")) {
                String sql = "UPDATE MedicineListItem SET MedicineListItemEditUser = ?, MedicineListItemEditDate = ?, MedicineDetails = ?, Status = ? WHERE MedicineListRef = ?;";
                jdbcTemplate.update(
                        sql,
                        medicineList.getMedicineListCreationUser(),
                        //String.valueOf(medicineList.getMedicineListCreationDate()),
                        LocalDateTime.now(),
                        json,
                        getCurrentLogin(),
                        medicineList.getMedicineListID()
                );
            } else {
                String sql = "UPDATE MedicineListItem SET MedicineListItemEditUser = ?, MedicineDetails = ?, Status = ? WHERE MedicineListRef = ?;";
                jdbcTemplate.update(
                        sql,
                        medicineList.getMedicineListCreationUser(),
                        //String.valueOf(medicineList.getMedicineListCreationDate()),
                        json,
                        getCurrentLogin(),
                        medicineList.getMedicineListID()
                );
            }
        } else {
            throw new AppException("Документ зараз редагується іншим користувачем", HttpStatus.CONFLICT);
        }
    }

    /**
     * Перевіряє, чи редагується медичний список іншими користувачами.
     *
     * @param id Ідентифікатор медичного списку.
     * @return true, якщо документ редагується, інакше false.
     */
    public Boolean isDocumentEditing(Integer id) {
        RowMapper<MedicineDetails> mapper = new RowMapper() {

            @SneakyThrows
            @Override
            public MedicineDetails mapRow(ResultSet rs, int rowNum) {
                MedicineDetails medicalListItem = new MedicineDetails();
                medicalListItem.setStatus(rs.getObject("Status", String.class));
                return medicalListItem;
            }
        };

        List<MedicineDetails> result = jdbcTemplate.query("SELECT Status FROM MedicineListItem WHERE MedicineListRef = ?;", mapper, id);
        if (!result.get(0).getStatus().equals("Saved")) {
            if (!result.get(0).getStatus().equals(getCurrentLogin())) {
                throw new AppException("Документ зараз редагується іншим користувачем", HttpStatus.CONFLICT);
            }
        }

        return false;
    }

    /**
     * Оновлює статус медичного списку за його ідентифікатором.
     *
     * @param id     Ідентифікатор медичного списку.
     * @param status Новий статус медичного списку.
     */
    public void updateMedicineListStatusByListId(Integer id, String status) {
        System.out.println("Updating status by id..." + status);
        RowMapper<MedicineDetails> mapper = new RowMapper() {

            @SneakyThrows
            @Override
            public MedicineDetails mapRow(ResultSet rs, int rowNum) {
                MedicineDetails medicalListItem = new MedicineDetails();
                medicalListItem.setStatus(rs.getObject("Status", String.class));
                return medicalListItem;
            }
        };

        List<MedicineDetails> result = jdbcTemplate.query("SELECT Status FROM MedicineListItem WHERE MedicineListRef = ?;", mapper, id);
        if (result.get(0).getStatus().equals("Saved") || result.get(0).getStatus().equals(getCurrentLogin())) {
            String sql = "UPDATE MedicineListItem SET Status = ? WHERE MedicineListRef = ?;";
            jdbcTemplate.update(
                    sql,
                    status,
                    id
            );
        }

    }

    /**
     * Отримує ім'я користувача з JWT токену.
     *
     * @param token JWT токен.
     * @return Ім'я користувача.
     */
    public static String getUsernameFromJwt(String token) {
        DecodedJWT decodedJWT = JWT.decode(token);
        return decodedJWT.getSubject(); // Typically, "sub" claim holds the username
    }

    /**
     * Отримує поточного користувача з контексту безпеки.
     *
     * @return Логін поточного користувача.
     */
    public static String getCurrentLogin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            return user.getLogin(); // Extract the `login` field
        }
        return null;
    }

    /**
     * Шукає пацієнтів за ключовим словом.
     *
     * @param keyword Ключове слово для пошуку.
     * @return Список пацієнтів, що відповідають пошуковому запиту.
     */
    public List<Patient> searchPatients(String keyword) {
        RowMapper<Patient> mapper = new RowMapper() {

            @Override
            @SneakyThrows
            public Patient mapRow(ResultSet rs, int rowNum) {
                Patient patient = new Patient();
                patient.setId(rs.getObject("PatientID", Integer.class));
                patient.setName(rs.getObject("PatientName", String.class));
                return patient;
            }
        };

        String sql = "SELECT PatientID, PatientName FROM Patient WHERE PatientName LIKE ?";
        String query = "%" + keyword + "%";
        return jdbcTemplate.query(sql, mapper, query);
    }

    public List<Patient> getAllInpatients(Boolean order) {

        RowMapper<Patient> mapper = new RowMapper() {

            @Override
            @SneakyThrows
            public Patient mapRow(ResultSet rs, int rowNum) {
                Patient patient = new Patient();
                patient.setId(rs.getObject("PatientID", Integer.class));
                patient.setName(rs.getObject("PatientName", String.class));
                patient.setHistoryNumber(rs.getObject("PatientHistoryNumber", String.class));
                patient.setAddress(rs.getObject("PatientAddress", String.class));
                patient.setPhone(rs.getObject("PatientPhone", String.class));
                patient.setDepartment(rs.getObject("VenueLevel2", String.class));
                patient.setRoomNumber(rs.getObject("VenueLevel1", String.class));
                patient.setBedNumber(rs.getObject("VenueLevel0", String.class));
                patient.setDoctor(rs.getObject("Doctor", String.class));
                patient.setGender(rs.getObject("PatientSexRef", String.class));
                patient.setAge(rs.getObject("Age", String.class));
                patient.setBirthDate(rs.getObject("PatientBirthDate", String.class));

                return patient;
            }
        };

        String ascDesc = order ? "ASC" : "DESC";

        /*return jdbcTemplate.query(
                "Select PatientID, PatientName," +
                        "PatientHistoryNumber," +
                        "PatientAddress," +
                        "PatientPhone," +
                        "v2.VenueName AS VenueLevel2," +
                        "v1.VenueName AS VenueLevel1," +
                        "v.VenueName AS VenueLevel0," +
                        "PatientSexRef," +
                        "DATEDIFF(YEAR, PatientBirthDate, GETDATE()) as Age, PatientBirthDate, u.UserName AS Doctor  from Patient " +
                        "left join Residence r on PatientRef = PatientID and ResidenceStatusRef = N'PRG'" +
                        "left join venue v on r.VenueRef = v.VenueID " +
                        "left join venue v1 on v.VenueParentRef = v1.VenueID " +
                        "left join venue v2 on v1.VenueParentRef = v2.VenueID " +
                        "left join Users u on u.UserLogin = r.UserRef " +
                        "where ResidenceSequence1Ref in (19) ORDER BY PatientName " + ascDesc + ";", mapper);*/

        List<Patient> patients = jdbcTemplate.query(
                "Select PatientID, PatientName," +
                        "PatientHistoryNumber," +
                        "PatientAddress," +
                        "PatientPhone," +
                        "v2.VenueName AS VenueLevel2," +
                        "v1.VenueName AS VenueLevel1," +
                        "v.VenueName AS VenueLevel0," +
                        "PatientSexRef," +
                        "DATEDIFF(YEAR, PatientBirthDate, GETDATE()) as Age, PatientBirthDate, u.UserName AS Doctor from Patient " +
                        "left join Residence r on PatientRef = PatientID and ResidenceStatusRef = N'PRG'" +
                        "left join venue v on r.VenueRef = v.VenueID " +
                        "left join venue v1 on v.VenueParentRef = v1.VenueID " +
                        "left join venue v2 on v1.VenueParentRef = v2.VenueID " +
                        "left join Users u on u.UserLogin = r.UserRef " +
                        "where ResidenceSequence1Ref in (19) ORDER BY PatientName " + ascDesc + ";", mapper);


        String editDatesSql = "SELECT mli.MedicineListItemEditDate, ml.PatientRef " +
                "FROM MedicineListItem mli " +
                "LEFT JOIN MedicineList ml ON mli.MedicineListRef = ml.MedicineListID";

        RowMapper<IdsAndDateTimes> dateTimesMapper = new RowMapper<IdsAndDateTimes>() {
            @Override
            public IdsAndDateTimes mapRow(ResultSet rs, int rowNum) throws SQLException {
                IdsAndDateTimes idsAndDateTimes = new IdsAndDateTimes();
                idsAndDateTimes.setPatientId(rs.getObject("PatientRef", Integer.class));
                idsAndDateTimes.setEditDateTime(rs.getObject("MedicineListItemEditDate", LocalDateTime.class));

                return idsAndDateTimes;
            }
        };

        List<IdsAndDateTimes> idDateTimes = jdbcTemplate.query(editDatesSql, dateTimesMapper);

        for (int i = 0; i < patients.size(); i++) {
            for (int j = 0; j < idDateTimes.size(); j++) {
                if (patients.get(i).getId().equals(idDateTimes.get(j).getPatientId())) {
                    patients.get(i).getMedicineListEditDates().add(idDateTimes.get(j).getEditDateTime());
                }
            }
        }

        return patients;
    }

    /**
     * Отримує пацієнта за його ідентифікатором.
     *
     * @param id Ідентифікатор пацієнта.
     * @return Об'єкт пацієнта.
     */
    public Patient getPatientById(Integer id) {
        RowMapper<Patient> mapper = new RowMapper() {

            @SneakyThrows
            @Override
            public Patient mapRow(ResultSet rs, int rowNum) {
                Patient patient = new Patient();
                patient.setId(rs.getObject("PatientID", Integer.class));
                patient.setName(rs.getObject("PatientName", String.class));
                patient.setHistoryNumber(rs.getObject("PatientHistoryNumber", String.class));
                patient.setAddress(rs.getObject("PatientAddress", String.class));
                patient.setPhone(rs.getObject("PatientPhone", String.class));
                patient.setDepartment(rs.getObject("VenueLevel2", String.class));
                patient.setRoomNumber(rs.getObject("VenueLevel1", String.class));
                patient.setBedNumber(rs.getObject("VenueLevel0", String.class));
                patient.setDoctor(rs.getObject("Doctor", String.class));
                patient.setGender(rs.getObject("PatientSexRef", String.class));
                patient.setAge(rs.getObject("Age", String.class));
                patient.setBirthDate(rs.getObject("PatientBirthDate", String.class));

                return patient;
            }
        };

        List<Patient> result = jdbcTemplate.query(
                "Select PatientID, PatientName," +
                        "PatientHistoryNumber," +
                        "PatientAddress," +
                        "PatientPhone," +
                        "v2.VenueName AS VenueLevel2," +
                        "v1.VenueName AS VenueLevel1," +
                        "v.VenueName AS VenueLevel0," +
                        "PatientSexRef," +
                        "DATEDIFF(YEAR, PatientBirthDate, GETDATE()) as Age, PatientBirthDate, u.UserName AS Doctor  from Patient " +
                        "left join Residence r on PatientRef = PatientID and ResidenceStatusRef = N'PRG'" +
                        "left join venue v on r.VenueRef = v.VenueID " +
                        "left join venue v1 on v.VenueParentRef = v1.VenueID " +
                        "left join venue v2 on v1.VenueParentRef = v2.VenueID " +
                        "left join Users u on u.UserLogin = r.UserRef " +
                        "where PatientID = ?;", mapper, id);

        return result.get(0);
    }

    /**
     * Отримує всі медичні списки для конкретного пацієнта за його ідентифікатором.
     *
     * @param id Ідентифікатор пацієнта.
     * @return Список медичних списків для пацієнта.
     */
    public List<MedicineList> getAllDocumentsByPatientId(Integer id) {
        RowMapper<MedicineList> mapper = new RowMapper() {

            @Override
            @SneakyThrows
            public MedicineList mapRow(ResultSet rs, int rowNum) {
                MedicineList medicalList = new MedicineList();
                medicalList.setMedicineListID(rs.getObject("MedicineListID", Integer.class));
                medicalList.setPatientRef(rs.getObject("PatientRef", Integer.class));
                medicalList.setDocumentName(rs.getObject("DocumentName", String.class));
                medicalList.setMedicineListCreationUser(rs.getObject("MedicineListCreationUser", String.class));
                medicalList.setMedicineListCreationDate(rs.getObject("MedicineListCreationDate", LocalDateTime.class));
                return medicalList;
            }
        };

        return jdbcTemplate.query("SELECT MedicineListId, PatientRef, DocumentName, MedicineListCreationUser, MedicineListCreationDate FROM MedicineList WHERE PatientRef = ?", mapper, id);
    }

    /**
     * Шукає медикаменти за ключовим словом.
     *
     * @param keyword Ключове слово для пошуку.
     * @return Список медикаментів, що відповідають пошуковому запиту.
     */
    public List<Medicine> searchMedicine(String keyword) {

        RowMapper<Medicine> mapper = new RowMapper() {

            @Override
            @SneakyThrows
            public Medicine mapRow(ResultSet rs, int rowNum) {
                Medicine medicine = new Medicine();
                medicine.setId(rs.getObject("MedicineID", Integer.class));
                medicine.setName(rs.getObject("MedicineName", String.class));
                return medicine;
            }
        };

        String sql = "SELECT MedicineID, MedicineName FROM Medicine WHERE MedicineName LIKE ?";
        String query = "%" + keyword + "%";

        return jdbcTemplate.query(sql, mapper, query);
    }

    /**
     * Видаляє медичний список за його ідентифікатором.
     *
     * @param id Ідентифікатор медичного списку.
     */
    public void deleteMedicineListById(Integer id) {
        String sql = """
                    DELETE FROM MedicineListItem WHERE MedicineListRef = ?;
                    DELETE FROM MedicineList WHERE MedicineListID = ?;
                """;

        jdbcTemplate.update(sql, id, id);
    }

    public void addNewChatId(Long chatId) {
        String sql = "INSERT INTO SH_MedicineListBotChatIds (chat_id) VALUES (?);";

        String finalSql = sql;
        jdbcTemplate.update(
                connection -> {
                    PreparedStatement ps = connection.prepareStatement(finalSql);
                    ps.setLong(1, chatId);
                    return ps;
                }
        );
    }

    public List<Long> getAllChatIds() {
        String sql = "SELECT chat_id from SH_MedicineListBotChatIds";
        return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getLong("chat_id"));
    }

    public void generateDeDocument(Integer medicineListID, String documentDateTime) {
        System.out.println(documentDateTime);
        String sql = "UPDATE MedicineList SET MakeDEDocument = ? WHERE MedicineListID = ?;";
        jdbcTemplate.update(
                sql,
                documentDateTime,
                medicineListID
        );
    }


}
