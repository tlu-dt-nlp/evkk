package ee.tlu.evkk.dal.dao;

import ee.tlu.evkk.dal.dao.interfaces.TokenDao;
import ee.tlu.evkk.dal.dto.AccessToken;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Mapper
@Repository
public interface AccessTokenDao extends TokenDao<AccessToken> {

  Optional<AccessToken> findByToken(@Param("token") String token);

  void deleteByToken(@Param("token") String token);

  void deleteByUserId(@Param("userId") UUID userId);

  String insert(@Param("accessToken") AccessToken accessToken);

  AccessToken findByUserId(@Param("userId") UUID userId);
}
