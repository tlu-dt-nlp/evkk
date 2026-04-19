package ee.tlu.evkk.clusterfinder.template;

import ee.tlu.evkk.clusterfinder.constants.AjaxConsts;
import ee.tlu.evkk.clusterfinder.constants.ClauseType;
import ee.tlu.evkk.clusterfinder.constants.TemplateConstants;
import ee.tlu.evkk.clusterfinder.constants.WordType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

import static java.util.Map.entry;
import static java.util.UUID.randomUUID;
import static java.util.stream.Collectors.toMap;

@Controller
@RequiredArgsConstructor
public class ClusterFinderTemplate {

  private static final Map<String, String> AJAX_URLS = Map.ofEntries(
    entry("clusterText", AjaxConsts.CLUSTER_TEXT),
    entry("clusterDownload", AjaxConsts.CLUSTER_DOWNLOAD),
    entry("uploadFile", AjaxConsts.FILE_UPLOAD)
  );

  @GetMapping("/")
  public String render(Model model, @RequestParam(value = "userFileId", required = false) String userFileId) {
    model.addAttribute("selectedFile", userFileId);
    model.addAttribute("formId", randomUUID().toString());
    return TemplateConstants.CLUSTER_SEARCH;
  }

  @ModelAttribute("ajaxUrls")
  public Map<String, String> getAjaxUrls() {
    return AJAX_URLS;
  }

  @ModelAttribute("wordTypes")
  public Map<String, String> getWordTypes() {
    return Arrays.stream(WordType.values())
      .collect(toMap(WordType::getValue, WordType::getLabelKey, (existing, replacement) -> existing, LinkedHashMap::new));
  }

  @ModelAttribute("clauseTypes")
  public Map<String, String> getClauseTypes() {
    return Arrays.stream(ClauseType.values())
      .collect(toMap(ClauseType::getValue, ClauseType::getLabelKey, (existing, replacement) -> existing, LinkedHashMap::new));
  }

}
