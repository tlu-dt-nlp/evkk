package ee.tlu.evkk.api.text.extractor;

import ee.tlu.evkk.api.io.MimeTypeDetector;
import ee.tlu.evkk.api.text.extractor.ex.TextExtractionException;
import ee.tlu.evkk.api.text.extractor.ex.UnsupportedMimeTypeException;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.core.io.InputStreamSource;
import org.springframework.stereotype.Component;
import org.springframework.util.MimeType;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Mikk Tarvas
 * Date: 04.06.2020
 */
@Component
public class ContentExtractorExecutor {

  private final MimeTypeDetector mimeTypeDetector;
  private final List<ContentExtractor> extractors;

  public ContentExtractorExecutor(MimeTypeDetector mimeTypeDetector, ObjectProvider<ContentExtractor> extractors) {
    this.mimeTypeDetector = mimeTypeDetector;
    this.extractors = extractors.orderedStream().collect(Collectors.toList());
  }

  @Nonnull
  public String extract(@Nonnull InputStreamSource iss, @Nullable String fileName) throws TextExtractionException, UnsupportedMimeTypeException {
    MimeType mimeType;
    try (InputStream is = iss.getInputStream()) {
      mimeType = mimeTypeDetector.detect(is, fileName);
    } catch (IOException ex) {
      throw new TextExtractionException("Unable to detect mime type", ex);
    }

    for (ContentExtractor extractor : extractors) {
      if (extractor.supports(mimeType)) return invokeExtractor(extractor, iss);
    }

    throw new UnsupportedMimeTypeException();
  }

  private String invokeExtractor(ContentExtractor extractor, InputStreamSource iss) throws TextExtractionException {
    try (InputStream is = iss.getInputStream()) {
      return extractor.extract(is);
    } catch (IOException ex) {
      throw new TextExtractionException("Unable to extract text", ex);
    }
  }

}
