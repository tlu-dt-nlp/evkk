package ee.tlu.evkk.api.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import ee.evkk.dto.enums.NoticeSeverity;
import ee.tlu.evkk.api.IntegrationTest;
import ee.tlu.evkk.api.controller.dto.NoticeRequestDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static java.time.temporal.ChronoUnit.DAYS;
import static java.util.UUID.randomUUID;
import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminNoticeControllerTest extends IntegrationTest {

  private static final String ADMIN_NOTICES = "/admin/notices";

  @Autowired
  private ObjectMapper objectMapper;

  static Stream<Arguments> adminEndpoints() throws Exception {
    String body = new ObjectMapper().writeValueAsString(validRequest());
    String orderBody = new ObjectMapper().writeValueAsString(List.of(randomUUID()));
    UUID id = randomUUID();

    return Stream.of(
      arguments("GET list", get(ADMIN_NOTICES)),
      arguments("POST create", post(ADMIN_NOTICES).contentType(APPLICATION_JSON).content(body)),
      arguments("PUT update", put(ADMIN_NOTICES + "/" + id).contentType(APPLICATION_JSON).content(body)),
      arguments("DELETE", delete(ADMIN_NOTICES + "/" + id)),
      arguments("PUT order", put(ADMIN_NOTICES + "/order").contentType(APPLICATION_JSON).content(orderBody))
    );
  }

  @ParameterizedTest(name = "{0}")
  @MethodSource("adminEndpoints")
  @DisplayName("Unauthenticated user cannot use admin notice endpoints")
  void unauthenticatedUserIsRejected(String name, MockHttpServletRequestBuilder request) throws Exception {
    mockMvc.perform(request).andExpect(status().isUnauthorized());
  }

  @ParameterizedTest(name = "{0}")
  @MethodSource("adminEndpoints")
  @WithMockUser(username = "user")
  @DisplayName("Authenticated non-admin user cannot use admin notice endpoints")
  void nonAdminUserIsRejected(String name, MockHttpServletRequestBuilder request) throws Exception {
    mockMvc.perform(request).andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Anyone can get the active notices")
  void anyoneCanGetActiveNotices() throws Exception {
    mockMvc.perform(get("/notices")).andExpect(status().isOk());
  }

  static Stream<Arguments> invalidRequests() {
    Instant now = Instant.now();
    return Stream.of(
      invalid("blank Estonian content", r -> r.setContentEt("   ")),
      invalid("whitespace-only English content", r -> r.setContentEn("\n\t ")),
      invalid("missing severity", r -> r.setSeverity(null)),
      invalid("missing pages", r -> r.setPages(null)),
      invalid("null page", r -> r.setPages(Arrays.asList("HOME", null))),
      invalid("lowercase page key", r -> r.setPages(List.of("tools"))),
      invalid("page key with empty segment", r -> r.setPages(List.of("TOOLS//WORDLIST"))),
      invalid("page key with trailing slash", r -> r.setPages(List.of("TOOLS/"))),
      invalid("too many pages", r -> r.setPages(IntStream.range(0, 101).mapToObj(i -> "PAGE_" + i).collect(toList()))),
      invalid("end time without start time", r -> r.setValidTo(now)),
      invalid("end time equal to start time", r -> {
        r.setValidFrom(now);
        r.setValidTo(now);
      }),
      invalid("end time before start time", r -> {
        r.setValidFrom(now);
        r.setValidTo(now.minusSeconds(60));
      })
    );
  }

  private static Arguments invalid(String name, Consumer<NoticeRequestDto> change) {
    return arguments(name, change);
  }

  @ParameterizedTest(name = "{0}")
  @MethodSource("invalidRequests")
  @WithMockUser(username = "admin", roles = { "ADMIN" })
  @DisplayName("Invalid notice is rejected on create and update")
  void invalidNoticeIsRejected(String name, Consumer<NoticeRequestDto> change) throws Exception {
    NoticeRequestDto request = validRequest();
    change.accept(request);
    String body = objectMapper.writeValueAsString(request);

    mockMvc.perform(post(ADMIN_NOTICES).contentType(APPLICATION_JSON).content(body))
      .andExpect(status().isBadRequest());
    mockMvc.perform(put(ADMIN_NOTICES + "/" + randomUUID()).contentType(APPLICATION_JSON).content(body))
      .andExpect(status().isBadRequest());
  }

  @Test
  @WithMockUser(username = "admin", roles = { "ADMIN" })
  @DisplayName("Updating or deleting a missing notice returns 404")
  void missingNoticeReturnsNotFound() throws Exception {
    String body = objectMapper.writeValueAsString(validRequest());

    mockMvc.perform(put(ADMIN_NOTICES + "/" + randomUUID()).contentType(APPLICATION_JSON).content(body))
      .andExpect(status().isNotFound());
    mockMvc.perform(delete(ADMIN_NOTICES + "/" + randomUUID()))
      .andExpect(status().isNotFound());
  }

  @Test
  @WithMockUser(username = "admin", roles = { "ADMIN" })
  @DisplayName("Reordering with an outdated list returns the NoticeOrderOutdated error code")
  void outdatedOrderIsRejected() throws Exception {
    createNotice(validRequest());

    mockMvc.perform(put(ADMIN_NOTICES + "/order").contentType(APPLICATION_JSON).content(json(List.of(randomUUID()))))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("$[0].code").value("NoticeOrderOutdated"));
  }

  @Test
  @WithMockUser(username = "admin", roles = { "ADMIN" })
  @DisplayName("Notices can be created, shown when active, reordered, updated and deleted")
  void noticeLifecycle() throws Exception {
    List<UUID> existingIds = ids(getAllNotices());

    // create: content is trimmed, duplicate pages are removed, the notice goes to the end of the order
    NoticeRequestDto activeRequest = validRequest();
    activeRequest.setContentEt("  Tere  ");
    activeRequest.setPages(List.of("TOOLS", "HOME", "TOOLS"));
    Map<String, Object> active = createNotice(activeRequest);
    assertThat(active)
      .containsEntry("contentEt", "Tere")
      .containsEntry("pages", List.of("TOOLS", "HOME"))
      .containsEntry("sortOrder", existingIds.size() + 1);
    assertThat(active.get("createdAt")).isNotNull();

    NoticeRequestDto scheduledRequest = validRequest();
    scheduledRequest.setValidFrom(Instant.now().plus(1, DAYS));
    Map<String, Object> scheduled = createNotice(scheduledRequest);
    assertThat(scheduled).containsEntry("sortOrder", existingIds.size() + 2);

    UUID activeId = UUID.fromString((String) active.get("id"));
    UUID scheduledId = UUID.fromString((String) scheduled.get("id"));

    // only notices within their validity period are returned to users
    List<UUID> shownIds = ids(readList(mockMvc.perform(get("/notices")).andExpect(status().isOk()).andReturn()));
    assertThat(shownIds).contains(activeId).doesNotContain(scheduledId);

    // reorder: the scheduled notice to the top
    List<UUID> newOrder = new ArrayList<>();
    newOrder.add(scheduledId);
    newOrder.addAll(existingIds);
    newOrder.add(activeId);
    List<Map<String, Object>> reordered = readList(mockMvc.perform(
        put(ADMIN_NOTICES + "/order").contentType(APPLICATION_JSON).content(json(newOrder)))
      .andExpect(status().isOk())
      .andReturn());
    assertThat(ids(reordered)).isEqualTo(newOrder);
    assertSortOrderIsContinuous(reordered);

    // update
    NoticeRequestDto update = validRequest();
    update.setContentEn("Updated");
    update.setSeverity(NoticeSeverity.ERROR);
    update.setPages(List.of());
    mockMvc.perform(put(ADMIN_NOTICES + "/" + activeId).contentType(APPLICATION_JSON).content(json(update)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.contentEn").value("Updated"))
      .andExpect(jsonPath("$.severity").value("ERROR"))
      .andExpect(jsonPath("$.pages").isEmpty());

    // delete: the order is compacted, so no gap is left at the top
    mockMvc.perform(delete(ADMIN_NOTICES + "/" + scheduledId)).andExpect(status().isNoContent());
    List<Map<String, Object>> afterDelete = getAllNotices();
    assertThat(ids(afterDelete)).doesNotContain(scheduledId).endsWith(activeId);
    assertSortOrderIsContinuous(afterDelete);
  }

  private static NoticeRequestDto validRequest() {
    return NoticeRequestDto.builder()
      .contentEt("Teade")
      .contentEn("Notice")
      .severity(NoticeSeverity.INFO)
      .pages(List.of("HOME"))
      .dismissible(true)
      .build();
  }

  private Map<String, Object> createNotice(NoticeRequestDto request) throws Exception {
    MvcResult result = mockMvc.perform(post(ADMIN_NOTICES).contentType(APPLICATION_JSON).content(json(request)))
      .andExpect(status().isOk())
      .andReturn();

    return objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<>() {});
  }

  private List<Map<String, Object>> getAllNotices() throws Exception {
    return readList(mockMvc.perform(get(ADMIN_NOTICES)).andExpect(status().isOk()).andReturn());
  }

  private List<Map<String, Object>> readList(MvcResult result) throws Exception {
    return objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<>() {});
  }

  private static List<UUID> ids(List<Map<String, Object>> notices) {
    return notices.stream().map(notice -> UUID.fromString((String) notice.get("id"))).collect(toList());
  }

  private static void assertSortOrderIsContinuous(List<Map<String, Object>> notices) {
    List<Object> sortOrders = notices.stream().map(notice -> notice.get("sortOrder")).collect(toList());
    assertThat(sortOrders).isEqualTo(IntStream.rangeClosed(1, notices.size()).boxed().collect(toList()));
  }
}
