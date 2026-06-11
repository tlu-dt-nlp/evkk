package ee.tlu.evkk.api.util;

import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class DateUtils {

  public static final DateTimeFormatter PG_TIMESTAMP_FORMAT = new DateTimeFormatterBuilder()
    .appendPattern("yyyy-MM-dd HH:mm:ss")
    .optionalStart().appendPattern(".SSSSSS").optionalEnd()
    .appendPattern("x")
    .toFormatter();
}
