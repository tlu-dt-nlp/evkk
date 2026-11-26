package ee.tlu.evkk.dal;

import com.fasterxml.jackson.databind.ObjectMapper;
import ee.tlu.evkk.dal.batis.handler.DurationTypeHandler;
import ee.tlu.evkk.dal.batis.handler.JsonTypeHandler;
import ee.tlu.evkk.dal.batis.handler.ListTypeHandler;
import ee.tlu.evkk.dal.batis.handler.UUIDTypeHandler;
import ee.tlu.evkk.dal.jdbc.SqlObjectFactory;
import ee.tlu.evkk.dal.json.Json;
import ee.tlu.evkk.dal.json.JsonFactory;
import org.apache.ibatis.type.TypeHandlerRegistry;
import org.mybatis.spring.annotation.MapperScan;
import org.mybatis.spring.boot.autoconfigure.ConfigurationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import javax.sql.DataSource;
import java.time.Duration;
import java.util.List;
import java.util.UUID;

/**
 * @author Mikk Tarvas
 * Date: 10.02.2020
 */
@Configuration
@ComponentScan
@MapperScan(basePackages = "ee.tlu.evkk.dal.dao")
public class DalConfiguration {

  @Bean
  public SqlObjectFactory sqlObjectFactory(DataSource dataSource) {
    return new SqlObjectFactory(dataSource);
  }

  @Bean
  public ConfigurationCustomizer configurationCustomizer(JsonFactory jsonFactory) {
    return configuration -> {

      configuration.setMapUnderscoreToCamelCase(true);

      // register custom type handlers
      TypeHandlerRegistry typeHandlerRegistry = configuration.getTypeHandlerRegistry();
      typeHandlerRegistry.register(Json.class, new JsonTypeHandler(jsonFactory));
      typeHandlerRegistry.register(UUID.class, UUIDTypeHandler.class);
      typeHandlerRegistry.register(Duration.class, DurationTypeHandler.class);
      // maps List properties/parameters to PostgreSQL arrays; <foreach> over a list is unaffected
      typeHandlerRegistry.register(List.class, ListTypeHandler.class);
    };
  }

  @Bean
  public JsonFactory jsonFactory(Jackson2ObjectMapperBuilder objectMapperBuilder) {
    ObjectMapper objectMapper = objectMapperBuilder.createXmlMapper(false).build();
    return new JsonFactory(objectMapper);
  }
}
