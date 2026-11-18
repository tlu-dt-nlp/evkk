package ee.tlu.evkk.dal.batis.handler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.Array;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Maps java.util.List to PostgreSQL arrays (text[], uuid[], int4[], int8[], bool[]) and back.
 * Registered globally for List in {@link ee.tlu.evkk.dal.DalConfiguration}:
 * <ul>
 *   <li>reading: List properties of result objects are mapped automatically;</li>
 *   <li>writing: MyBatis resolves parameter handlers by the runtime class (ArrayList, List.of(...), ...), not by
 *   interface, so add the type hint: {@code #{notice.pages,javaType=java.util.List}}.</li>
 * </ul>
 * <p>
 * The SQL array type is inferred from the first non-null element. An empty list is sent as text[],
 * so cast it explicitly in SQL (e.g. {@code #{ids}::uuid[]}) when binding an empty list to a non-text array.
 * <p>
 * Lists iterated with {@code <foreach>} are not affected, as their elements are bound one by one.
 */
public class ListTypeHandler extends BaseTypeHandler<List<?>> {

  @Override
  public void setNonNullParameter(PreparedStatement ps, int i, List<?> parameter, JdbcType jdbcType) throws SQLException {
    ps.setArray(i, ps.getConnection().createArrayOf(sqlElementType(parameter), parameter.toArray()));
  }

  @Override
  public List<?> getNullableResult(ResultSet rs, String columnName) throws SQLException {
    return toList(rs.getArray(columnName));
  }

  @Override
  public List<?> getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
    return toList(rs.getArray(columnIndex));
  }

  @Override
  public List<?> getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
    return toList(cs.getArray(columnIndex));
  }

  private static String sqlElementType(List<?> list) {
    Object sample = list.stream().filter(Objects::nonNull).findFirst().orElse(null);
    if (sample == null || sample instanceof String) return "text";
    if (sample instanceof UUID) return "uuid";
    if (sample instanceof Integer) return "int4";
    if (sample instanceof Long) return "int8";
    if (sample instanceof Boolean) return "bool";
    throw new IllegalArgumentException("Unsupported list element type for SQL array: " + sample.getClass().getName());
  }

  private static List<?> toList(Array array) throws SQLException {
    if (array == null) return null;
    try {
      return new ArrayList<>(Arrays.asList((Object[]) array.getArray()));
    } finally {
      array.free();
    }
  }
}
