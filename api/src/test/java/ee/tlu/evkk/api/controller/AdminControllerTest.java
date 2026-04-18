package ee.tlu.evkk.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ee.evkk.dto.TextUpdateRequestDto;
import ee.tlu.evkk.api.IntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.Collections;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
  @DisplayName("Unauthenticated user cannot get donated text details")
  void unauthenticatedUserCannotGetDonatedTextDetails() throws Exception {
    UUID testId = UUID.randomUUID();
    mockMvc.perform(
        get("/admin/donated-texts/" + testId))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Authenticated non-admin user cannot get donated text details")
  @WithMockUser(username = "user")
  void authenticatedUserCannotGetDonatedTextDetails() throws Exception {
    UUID testId = UUID.randomUUID();
    mockMvc.perform(
        get("/admin/donated-texts/" + testId))
      .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Authenticated admin user gets 404 when donated text not found")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserGets404WhenDonatedTextNotFound() throws Exception {
    UUID nonExistentId = UUID.randomUUID();
    mockMvc.perform(
        get("/admin/donated-texts/" + nonExistentId))
      .andExpect(status().isNotFound());
  }

  @Test
  @DisplayName("Unauthenticated user cannot get published text details")
  void unauthenticatedUserCannotGetPublishedTextDetails() throws Exception {
    UUID testId = UUID.randomUUID();
    mockMvc.perform(
        get("/admin/published-texts/" + testId))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Authenticated non-admin user cannot get published text details")
  @WithMockUser(username = "user")
  void authenticatedUserCannotGetPublishedTextDetails() throws Exception {
    UUID testId = UUID.randomUUID();
    mockMvc.perform(
        get("/admin/published-texts/" + testId))
      .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Authenticated admin user gets 404 when published text not found")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserGets404WhenPublishedTextNotFound() throws Exception {
    UUID nonExistentId = UUID.randomUUID();
    mockMvc.perform(
        get("/admin/published-texts/" + nonExistentId))
      .andExpect(status().isNotFound());
  }

  @Test
  @DisplayName("Unauthenticated user cannot update published text")
  void unauthenticatedUserCannotUpdatePublishedText() throws Exception {
    UUID testId = UUID.randomUUID();

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("New text");
    request.setProperties(Collections.emptyList());

    mockMvc.perform(
        put("/admin/published-texts/" + testId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Authenticated non-admin user cannot update published text")
  @WithMockUser(username = "user")
  void authenticatedUserCannotUpdatePublishedText() throws Exception {
    UUID testId = UUID.randomUUID();

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("New text");
    request.setProperties(Collections.emptyList());

    mockMvc.perform(
        put("/admin/published-texts/" + testId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Authenticated admin user gets 400 when updating published text properties to null")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserGets400WhenUpdatingPublishedTextPropertiesToNull() throws Exception {
    UUID testId = UUID.randomUUID();

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("New text");
    request.setProperties(null);

    mockMvc.perform(
        put("/admin/published-texts/" + testId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isBadRequest());
  }
}
