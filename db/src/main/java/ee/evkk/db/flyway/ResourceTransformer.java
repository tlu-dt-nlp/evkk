package ee.evkk.db.flyway;

import ee.tlu.evkk.common.io.ResourceWrapper;
import org.apache.commons.io.input.ReaderInputStream;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.configuration.Configuration;
import org.flywaydb.core.internal.database.DatabaseFactory;
import org.flywaydb.core.internal.database.base.Database;
import org.flywaydb.core.internal.jdbc.JdbcConnectionFactory;
import org.flywaydb.core.internal.parser.ParsingContext;
import org.flywaydb.core.internal.parser.PlaceholderReplacingReader;
import org.springframework.core.io.Resource;
import org.springframework.lang.NonNull;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

/**
 * @author Mikk Tarvas
 * Date: 02.10.2021
 */
public class ResourceTransformer {

  private final Configuration configuration;
  private final ParsingContext parsingContext;

  public ResourceTransformer(Flyway flyway) {
    this.configuration = flyway.getConfiguration();
    this.parsingContext = createParsingContext(this.configuration);
  }

  public Resource transform(Resource resource) {
    return new TransformingResource(resource);
  }

  private static ParsingContext createParsingContext(Configuration configuration) {
    Database<?> database = createDatabase(configuration);
    ParsingContext parsingContext = new ParsingContext();
    parsingContext.populate(database, configuration);
    return parsingContext;
  }

  private static Database<?> createDatabase(Configuration configuration) {
    JdbcConnectionFactory jdbcConnectionFactory = new JdbcConnectionFactory(configuration.getDataSource(), configuration.getConnectRetries());
    return DatabaseFactory.createDatabase(configuration, false, jdbcConnectionFactory);
  }

  private class TransformingResource extends ResourceWrapper {

    private TransformingResource(Resource delegate) {
      super(delegate);
    }

    private PlaceholderReplacingReader createPlaceholderReplacingReader(Reader reader) {
      return PlaceholderReplacingReader.create(configuration, parsingContext, reader);
    }

    @NonNull
    @Override
    public InputStream getInputStream() throws IOException {
      InputStream is = super.getInputStream();
      InputStreamReader reader = new InputStreamReader(is, configuration.getEncoding());
      PlaceholderReplacingReader replacingReader = createPlaceholderReplacingReader(reader);
      return new ReaderInputStream(replacingReader, configuration.getEncoding());
    }

  }

}
