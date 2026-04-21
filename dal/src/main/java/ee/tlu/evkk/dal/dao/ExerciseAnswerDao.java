package ee.tlu.evkk.dal.dao;

import ee.tlu.evkk.dal.dto.ExerciseAnswer;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Mapper
@Repository
public interface ExerciseAnswerDao {

  void insert(
    @Param("id") UUID id,
    @Param("answers") String answersJson,
    @Param("exerciseData") String exerciseDataJson
  );

  ExerciseAnswer findById(@Param("id") UUID id);
}
