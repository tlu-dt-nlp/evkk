package ee.tlu.evkk.taskscheduler.task;

import ee.tlu.evkk.dal.dao.ExerciseAnswerDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ExerciseCleanupTask {

  private final ExerciseAnswerDao exerciseAnswerDao;

  public void execute() {
    try {
      int deletedCount = exerciseAnswerDao.deleteOlderThan24Hours();
      log.info("Deleted {} exercise_answer rows older than 24 hours", deletedCount);
    } catch (Exception ex) {
      log.error("Failed to delete old exercise answers", ex);
    }
  }
}
