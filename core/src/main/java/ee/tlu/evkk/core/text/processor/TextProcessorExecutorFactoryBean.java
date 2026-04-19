package ee.tlu.evkk.core.text.processor;

import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;

import java.util.Collection;

import static java.util.stream.Collectors.toList;

/**
 * @author Mikk Tarvas
 * Date: 22.01.2022
 */
@Component
public class TextProcessorExecutorFactoryBean implements FactoryBean<TextProcessorExecutor> {

  private final Collection<TextProcessor> processors;

  public TextProcessorExecutorFactoryBean(ObjectProvider<TextProcessor> processors) {
    this.processors = processors.stream().collect(toList());
  }

  @Override
  public TextProcessorExecutor getObject() {
    return TextProcessorExecutor.create(processors);
  }

  @Override
  public Class<?> getObjectType() {
    return TextProcessorExecutor.class;
  }

}
