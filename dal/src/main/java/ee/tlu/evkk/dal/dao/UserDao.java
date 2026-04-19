package ee.tlu.evkk.dal.dao;

import ee.tlu.evkk.dal.dto.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Mapper
@Repository
public interface UserDao {

  User findByIdCode(@Param("idCode") String idCode);

  User findById(@Param("id") UUID id);

  Optional<User> findByRefreshToken(@Param("token") String refreshToken);

  User insert(@Param("user") User user);
}
