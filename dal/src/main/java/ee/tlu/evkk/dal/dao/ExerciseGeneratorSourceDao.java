package ee.tlu.evkk.dal.dao;

import ee.evkk.dto.enums.ExerciseStructureType;
import ee.evkk.dto.enums.ExerciseType;
import ee.tlu.evkk.dal.dto.ExerciseGeneratorSource;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ExerciseGeneratorSourceDao {

  List<ExerciseGeneratorSource> findSourcesForExercise(
    @Param("structureType") ExerciseStructureType structureType,
    @Param("type") ExerciseType type,
    @Param("topic") String topic
  );
}
