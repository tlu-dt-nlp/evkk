package ee.tlu.evkk.dal.dao.interfaces;

import java.util.Optional;
import java.util.UUID;

public interface TokenDao<T> {

  Optional<T> findByToken(String token);

  void deleteByToken(String token);

  void deleteByUserId(UUID userId);
}
