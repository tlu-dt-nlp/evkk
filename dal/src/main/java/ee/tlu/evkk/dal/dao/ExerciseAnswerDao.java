package ee.tlu.evkk.dal.dao;

import ee.evkk.dto.enums.ExerciseFormat;
import ee.evkk.dto.enums.ExerciseStructureType;
import ee.evkk.dto.enums.ExerciseType;
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
    @Param("type") ExerciseType type,
    @Param("structureType") ExerciseStructureType structureType,
    @Param("format") ExerciseFormat format,
    @Param("answers") String answersJson,
    @Param("exerciseData") String exerciseDataJson
  );

  ExerciseAnswer findById(@Param("id") UUID id);

  int deleteOlderThan24Hours();
}
