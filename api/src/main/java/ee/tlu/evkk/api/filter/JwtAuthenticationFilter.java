package ee.tlu.evkk.api.filter;

import ee.tlu.evkk.api.exception.UnauthorizedException;
import ee.tlu.evkk.api.service.interfaces.AbstractAccessTokenService;
import ee.tlu.evkk.api.service.interfaces.AbstractJwtTokenService;
import ee.tlu.evkk.dal.dto.User;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import static java.lang.String.format;
import static org.apache.logging.log4j.util.Strings.isNotEmpty;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final AbstractAccessTokenService accessTokenService;
  private final AbstractJwtTokenService jwtTokenService;
  private final HandlerExceptionResolver handlerExceptionResolver;

  @Override
  protected void doFilterInternal(@NonNull HttpServletRequest request,
                                  @NonNull HttpServletResponse response,
                                  @NonNull FilterChain filterChain) throws ServletException, IOException {
    if (SecurityContextHolder.getContext().getAuthentication() == null) {
      String authHeader = request.getHeader("Authorization");

      if (isNotEmpty(authHeader) && authHeader.startsWith("Bearer ")) {
        String token = authHeader.substring(7);
        try {
          if (accessTokenService.isExistingTokenValid(token)) {
            User user = jwtTokenService.extractUser(token);
            Authentication authentication = new UsernamePasswordAuthenticationToken(user, token, getAuthorities(user));
            SecurityContextHolder.getContext().setAuthentication(authentication);
          }
        } catch (Exception e) {
          handlerExceptionResolver.resolveException(request, response, null, new UnauthorizedException());
        }
      }
    }

    filterChain.doFilter(request, response);
  }

  private Set<GrantedAuthority> getAuthorities(User user) {
    Set<GrantedAuthority> authorities = new HashSet<>();
    authorities.add(new SimpleGrantedAuthority(format("ROLE_%s", user.getRoleName())));
    return authorities;
  }
}
