package ee.tlu.evkk.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ee.evkk.dto.CorpusRequestDto;
import ee.evkk.dto.DonatedTextRequestDto;
import ee.evkk.dto.TextUpdateRequestDto;
import ee.tlu.evkk.api.IntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;

import static java.util.Collections.emptyList;
import static java.util.UUID.randomUUID;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminControllerTest extends IntegrationTest {

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  @DisplayName("Unauthenticated user cannot get amount of texts to review")
  void unauthenticatedUserCannotGetAmountOfTextsToReview() throws Exception {
    mockMvc.perform(
        get("/admin/texts-to-review"))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Authenticated non-admin user cannot get amount of texts to review")
  @WithMockUser(username = "user")
  void authenticatedUserCannotGetAmountOfTextsToReview() throws Exception {
    mockMvc.perform(
        get("/admin/texts-to-review"))
      .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Authenticated admin user can get amount of texts to review")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserCanGetAmountOfTextsToReview() throws Exception {
    mockMvc.perform(
        get("/admin/texts-to-review"))
      .andExpect(status().isOk());
  }

  @Test
  @DisplayName("Unauthenticated user cannot get donated texts")
  void unauthenticatedUserCannotGetDonatedTexts() throws Exception {
    mockMvc.perform(
        post("/admin/donated-texts")
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(new DonatedTextRequestDto())))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Authenticated non-admin user cannot get donated texts")
  @WithMockUser(username = "user")
  void authenticatedUserCannotGetDonatedTexts() throws Exception {
    mockMvc.perform(
        post("/admin/donated-texts")
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(new DonatedTextRequestDto())))
      .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Authenticated admin user can get donated texts")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserCanGetDonatedTexts() throws Exception {
    DonatedTextRequestDto request = new DonatedTextRequestDto();
    request.setAutoriEmakeel("nonExistentLanguage");

    mockMvc.perform(
        post("/admin/donated-texts")
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isOk());
  }

  @Test
  @DisplayName("Unauthenticated user cannot get donated text details")
  void unauthenticatedUserCannotGetDonatedTextDetails() throws Exception {
    mockMvc.perform(
        get("/admin/donated-texts/" + randomUUID()))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Authenticated non-admin user cannot get donated text details")
  @WithMockUser(username = "user")
  void authenticatedUserCannotGetDonatedTextDetails() throws Exception {
    mockMvc.perform(
        get("/admin/donated-texts/" + randomUUID()))
      .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Authenticated admin user gets 404 when donated text not found")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserGets404WhenDonatedTextNotFound() throws Exception {
    mockMvc.perform(
        get("/admin/donated-texts/" + randomUUID()))
      .andExpect(status().isNotFound());
  }

  @Test
  @DisplayName("Unauthenticated user cannot update donated text")
  void unauthenticatedUserCannotUpdateDonatedText() throws Exception {
    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("New text");
    request.setProperties(emptyList());

    mockMvc.perform(
        put("/admin/donated-texts/" + randomUUID())
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Authenticated non-admin user cannot update donated text")
  @WithMockUser(username = "user")
  void authenticatedUserCannotUpdateDonatedText() throws Exception {
    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("New text");
    request.setProperties(emptyList());

    mockMvc.perform(
        put("/admin/donated-texts/" + randomUUID())
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Authenticated admin user gets 400 when updating donated text properties to null")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserGets400WhenUpdatingDonatedTextPropertiesToNull() throws Exception {
    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("New text");
    request.setProperties(null);

    mockMvc.perform(
        put("/admin/donated-texts/" + randomUUID())
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isBadRequest());
  }

  @Test
  @DisplayName("Authenticated admin user gets 404 when updating non-existent donated text")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserGets404WhenUpdatingNonExistentDonatedText() throws Exception {
    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("New text");
    request.setProperties(emptyList());

    mockMvc.perform(
        put("/admin/donated-texts/" + randomUUID())
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isNotFound());
  }

  @Test
  @DisplayName("Unauthenticated user cannot delete donated text")
  void unauthenticatedUserCannotDeleteDonatedText() throws Exception {
    mockMvc.perform(
        delete("/admin/donated-texts/" + randomUUID()))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Authenticated non-admin user cannot delete donated text")
  @WithMockUser(username = "user")
  void authenticatedUserCannotDeleteDonatedText() throws Exception {
    mockMvc.perform(
        delete("/admin/donated-texts/" + randomUUID()))
      .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Authenticated admin user gets 404 when deleting non-existent donated text")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserGets404WhenDeletingNonExistentDonatedText() throws Exception {
    mockMvc.perform(
        delete("/admin/donated-texts/" + randomUUID()))
      .andExpect(status().isNotFound());
  }

  @Test
  @DisplayName("Unauthenticated user cannot publish donated text")
  void unauthenticatedUserCannotPublishDonatedText() throws Exception {
    mockMvc.perform(
        post("/admin/donated-texts/" + randomUUID() + "/publish"))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Authenticated non-admin user cannot publish donated text")
  @WithMockUser(username = "user")
  void authenticatedUserCannotPublishDonatedText() throws Exception {
    mockMvc.perform(
        post("/admin/donated-texts/" + randomUUID() + "/publish"))
      .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Authenticated admin user gets 400 when publishing with null properties")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserGets400WhenPublishingWithNullProperties() throws Exception {
    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("New text");
    request.setProperties(null);

    mockMvc.perform(
        post("/admin/donated-texts/" + randomUUID() + "/publish")
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isBadRequest());
  }

  @Test
  @DisplayName("Authenticated admin user gets 404 when publishing non-existent donated text")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserGets404WhenPublishingNonExistentDonatedText() throws Exception {
    mockMvc.perform(
        post("/admin/donated-texts/" + randomUUID() + "/publish"))
      .andExpect(status().isNotFound());
  }

  @Test
  @DisplayName("Unauthenticated user cannot get published texts")
  void unauthenticatedUserCannotGetPublishedTexts() throws Exception {
    mockMvc.perform(
        post("/admin/published-texts")
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(new CorpusRequestDto())))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Authenticated non-admin user cannot get published texts")
  @WithMockUser(username = "user")
  void authenticatedUserCannotGetPublishedTexts() throws Exception {
    mockMvc.perform(
        post("/admin/published-texts")
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(new CorpusRequestDto())))
      .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Authenticated admin user can get published texts")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserCanGetPublishedTexts() throws Exception {
    CorpusRequestDto request = new CorpusRequestDto();
    request.setLanguage("nonExistentLanguage");

    mockMvc.perform(
        post("/admin/published-texts")
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isOk());
  }

  @Test
  @DisplayName("Unauthenticated user cannot get published text details")
  void unauthenticatedUserCannotGetPublishedTextDetails() throws Exception {
    mockMvc.perform(
        get("/admin/published-texts/" + randomUUID()))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Authenticated non-admin user cannot get published text details")
  @WithMockUser(username = "user")
  void authenticatedUserCannotGetPublishedTextDetails() throws Exception {
    mockMvc.perform(
        get("/admin/published-texts/" + randomUUID()))
      .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Authenticated admin user gets 404 when published text not found")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserGets404WhenPublishedTextNotFound() throws Exception {
    mockMvc.perform(
        get("/admin/published-texts/" + randomUUID()))
      .andExpect(status().isNotFound());
  }

  @Test
  @DisplayName("Unauthenticated user cannot update published text")
  void unauthenticatedUserCannotUpdatePublishedText() throws Exception {
    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("New text");
    request.setProperties(emptyList());

    mockMvc.perform(
        put("/admin/published-texts/" + randomUUID())
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Authenticated non-admin user cannot update published text")
  @WithMockUser(username = "user")
  void authenticatedUserCannotUpdatePublishedText() throws Exception {
    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("New text");
    request.setProperties(emptyList());

    mockMvc.perform(
        put("/admin/published-texts/" + randomUUID())
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Authenticated admin user gets 400 when updating published text properties to null")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserGets400WhenUpdatingPublishedTextPropertiesToNull() throws Exception {
    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("New text");
    request.setProperties(null);

    mockMvc.perform(
        put("/admin/published-texts/" + randomUUID())
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isBadRequest());
  }

  @Test
  @DisplayName("Authenticated admin user gets 404 when updating non-existent published text")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserGets404WhenUpdatingNonExistentPublishedText() throws Exception {
    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("New text");
    request.setProperties(emptyList());

    mockMvc.perform(
        put("/admin/published-texts/" + randomUUID())
          .contentType(APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isNotFound());
  }

  @Test
  @DisplayName("Unauthenticated user cannot delete published text")
  void unauthenticatedUserCannotDeletePublishedText() throws Exception {
    mockMvc.perform(
        delete("/admin/published-texts/" + randomUUID()))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Authenticated non-admin user cannot delete published text")
  @WithMockUser(username = "user")
  void authenticatedUserCannotDeletePublishedText() throws Exception {
    mockMvc.perform(
        delete("/admin/published-texts/" + randomUUID()))
      .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Authenticated admin user gets 404 when deleting non-existent published text")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserGets404WhenDeletingNonExistentPublishedText() throws Exception {
    mockMvc.perform(
        delete("/admin/published-texts/" + randomUUID()))
      .andExpect(status().isNotFound());
  }
}
