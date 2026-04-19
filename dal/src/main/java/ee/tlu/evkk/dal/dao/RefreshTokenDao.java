package ee.tlu.evkk.dal.dao;

import ee.tlu.evkk.dal.dao.interfaces.TokenDao;
import ee.tlu.evkk.dal.dto.RefreshToken;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Mapper
@Repository
public interface RefreshTokenDao extends TokenDao<RefreshToken> {

  Optional<RefreshToken> findByToken(@Param("token") String token);

  void deleteByToken(@Param("token") String token);

  void deleteByUserId(@Param("userId") UUID userId);

  RefreshToken insert(@Param("refreshToken") RefreshToken refreshToken);
}
