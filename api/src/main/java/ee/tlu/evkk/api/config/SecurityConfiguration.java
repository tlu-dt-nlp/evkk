package ee.tlu.evkk.api.config;

import ee.tlu.evkk.api.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.annotation.Nonnull;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

/**
 * @author Mikk Tarvas
 * Date: 04.02.2020
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@RequiredArgsConstructor
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    CookieCsrfTokenRepository csrfTokenRepository = new CookieCsrfTokenRepository();
    csrfTokenRepository.setCookieHttpOnly(false); //TODO: get via conf flag

    http
      .csrf().disable() //TODO: use repo
      .authorizeRequests()
      .antMatchers("/actuator/**").hasRole("ADMIN")
      .anyRequest().permitAll().and()
      .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
      .sessionManagement().sessionCreationPolicy(STATELESS).and()
      .logout().logoutSuccessHandler(logoutSuccessHandler()).and()
      .exceptionHandling().authenticationEntryPoint(authenticationEntryPoint());
  }

  private AuthenticationEntryPoint authenticationEntryPoint() {
    return new HttpStatusEntryPoint(UNAUTHORIZED);
  }

  private LogoutSuccessHandler logoutSuccessHandler() {
    return new HttpStatusReturningLogoutSuccessHandler(OK);
  }

  @Component
  public static class CorsFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(@Nonnull final HttpServletRequest request,
                                    final HttpServletResponse response,
                                    final FilterChain filterChain) throws ServletException, IOException {
      response.addHeader("Access-Control-Allow-Origin", "*");
      response.addHeader("Access-Control-Allow-Methods", "*");
      response.addHeader("Access-Control-Allow-Headers", "*");
      response.addHeader("Access-Control-Allow-Credentials", "true");
      response.addIntHeader("Access-Control-Max-Age", 3600);
      filterChain.doFilter(request, response);
    }
  }

}
