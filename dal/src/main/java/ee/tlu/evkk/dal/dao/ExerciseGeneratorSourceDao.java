package ee.tlu.evkk.dal.dao;

import ee.evkk.dto.enums.ExerciseType;
import ee.tlu.evkk.dal.dto.ExerciseGeneratorSource;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ExerciseGeneratorSourceDao {

  List<ExerciseGeneratorSource> findTextsForExercise(@Param("type") ExerciseType type, @Param("topic") String topic);

  List<ExerciseGeneratorSource> findSentencesForExercise(@Param("type") ExerciseType type, @Param("topic") String topic);
}
