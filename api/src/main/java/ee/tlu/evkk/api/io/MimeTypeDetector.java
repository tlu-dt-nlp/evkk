package ee.tlu.evkk.api.io;

import org.apache.commons.io.FilenameUtils;
import org.apache.tika.config.TikaConfig;
import org.apache.tika.detect.Detector;
import org.apache.tika.exception.TikaException;
import org.apache.tika.io.TikaInputStream;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.mime.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.MimeType;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.util.Map;

import static java.util.Objects.requireNonNull;
import static org.springframework.util.MimeType.valueOf;

/**
 * @author Mikk Tarvas
 * Date: 04.06.2020
 */
@Component
public class MimeTypeDetector {

  // If we can not detect mime type, fall back to binary stream
  private static final MimeType DEFAULT_MIME_TYPE = valueOf("application/octet-stream");

  private static final Map<String, MimeType> EXTENSION_TYPE_MAP;

  static {
    EXTENSION_TYPE_MAP = Map.of(
      "txt", valueOf("text/plain"),
      "doc", valueOf("application/msword"),
      "docx", valueOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
      "htm", valueOf("text/html"),
      "html", valueOf("text/html"),
      "pdf", valueOf("application/pdf"),
      "rtf", valueOf("application/rtf"),
      "odt", valueOf("application/vnd.oasis.opendocument.text")
    );
  }

  private final Detector tikaDetector;

  public MimeTypeDetector() throws TikaException, IOException {
    TikaConfig tikaConfig = new TikaConfig();
    this.tikaDetector = tikaConfig.getDetector();
  }

  @Nonnull
  public MimeType detect(@Nonnull InputStream is, @Nullable String name) throws IOException {
    requireNonNull(is);

    MimeType fromInputStream = detectFromInputStream(is, name);
    if (isAcceptable(fromInputStream)) return fromInputStream;

    MimeType fromName = detectFromName(name);
    if (isAcceptable(fromName)) return fromName;

    return DEFAULT_MIME_TYPE;
  }

  private MimeType detectFromInputStream(InputStream is, String name) throws IOException {
    if (is == null) return null;

    MimeType fromStream = detectFromUrlConnection(is);
    if (isAcceptable(fromStream)) return fromStream;

    MimeType fromTika = detectFromTika(is, name);
    if (isAcceptable(fromTika)) return fromTika;

    return null;
  }

  private MimeType detectFromUrlConnection(InputStream is) {
    try {
      return parseMimeType(URLConnection.guessContentTypeFromStream(is));
    } catch (Exception ex) {
      return null;
    }
  }

  private MimeType detectFromTika(InputStream is, String name) throws IOException {
    if (1 == 1) return null;

    Metadata metadata = new Metadata();
    // metadata.set(Metadata.RESOURCE_NAME_KEY, name); //TODO:

    MediaType detect;
    try (TikaInputStream tis = TikaInputStream.get(is)) {
      detect = tikaDetector.detect(tis, metadata);
    }

    return parseMimeType(detect.toString());
  }

  private MimeType detectFromName(String name) {
    if (name == null) return null;

    MimeType fromName = parseMimeType(URLConnection.guessContentTypeFromName(name.toLowerCase()));
    if (isAcceptable(fromName)) return fromName;

    String extension = FilenameUtils.getExtension(name);
    MimeType mimeType = EXTENSION_TYPE_MAP.get(extension.toLowerCase());
    if (isAcceptable(mimeType)) return mimeType;

    return null;
  }

  @SuppressWarnings("RedundantIfStatement")
  private boolean isAcceptable(MimeType mimeType) {
    if (mimeType == null) return false;
    //TODO: return false for stuff like binary stream, etc
    return true;
  }

  private MimeType parseMimeType(String mimeType) {
    if (mimeType == null) return null;
    try {
      return valueOf(mimeType);
    } catch (Exception ex) {
      return null;
    }
  }

}
