package ee.tlu.evkk.api.controller;

import ee.tlu.evkk.api.text.extractor.ContentExtractorExecutor;
import ee.tlu.evkk.api.text.extractor.ex.TextExtractionException;
import ee.tlu.evkk.api.text.extractor.ex.UnsupportedMimeTypeException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin("*")
@RequiredArgsConstructor
@RestController
public class ContentExtractorController {

  private final ContentExtractorExecutor extractor;

  @PostMapping("/textfromfile")
  public String textFromFile(@RequestParam("file") MultipartFile[] files) throws UnsupportedMimeTypeException, TextExtractionException {
    StringBuilder data = new StringBuilder();
    for (MultipartFile file : files) {
      data.append(extractor.extract(file, file.getOriginalFilename())).append(" ");
    }
    return data.toString().trim();
  }
}
