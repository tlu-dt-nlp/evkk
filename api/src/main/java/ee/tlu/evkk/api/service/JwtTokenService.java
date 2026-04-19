package ee.tlu.evkk.api.service;

import ee.tlu.evkk.api.service.interfaces.AbstractJwtTokenService;
import ee.tlu.evkk.dal.dto.AccessToken;
import ee.tlu.evkk.dal.dto.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static ee.tlu.evkk.api.constant.AuthConstants.ACCESS_TOKEN_EXPIRES_IN_MILLISECONDS;
import static io.jsonwebtoken.io.Decoders.BASE64;
import static io.jsonwebtoken.security.Keys.hmacShaKeyFor;
import static java.lang.String.format;
import static java.lang.System.currentTimeMillis;
import static java.time.Instant.now;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Service
public class JwtTokenService implements AbstractJwtTokenService {

  @Value("${auth.jwt-token-secret}")
  private String jwtTokenSecret;

  public String generateToken(User user) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("emailAddress", user.getEmailAddress());
    claims.put("idCode", user.getIdCode());
    claims.put("idCodePrefix", user.getIdCodePrefix());
    claims.put("firstName", user.getFirstName());
    claims.put("middleName", user.getMiddleName());
    claims.put("lastName", user.getLastName());
    claims.put("fullName", format("%s%s %s",
      user.getFirstName(),
      isEmpty(user.getMiddleName()) ? "" : " " + user.getMiddleName(),
      user.getLastName())
    );
    claims.put("roleName", user.getRoleName());
    claims.put("uiLocales", user.getUiLocales());
    return createToken(claims, user.getIdCode());
  }

  public User extractUser(String token) {
    Claims claims = extractClaims(token);

    return new User(
      (String) claims.get("emailAddress"),
      (String) claims.get("idCode"),
      (String) claims.get("idCodePrefix"),
      (String) claims.get("firstName"),
      (String) claims.get("middleName"),
      (String) claims.get("lastName"),
      (String) claims.get("roleName"),
      (String) claims.get("uiLocales")
    );
  }

  public boolean isTokenValid(AccessToken accessToken) {
    return extractExpiration(accessToken.getToken()).after(new Date());
  }

  public boolean isPersistedTokenInvalid(AccessToken token) {
    return token.getExpiresAt().isBefore(now());
  }

  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    Claims claims = extractClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractClaims(String token) {
    return Jwts
      .parser()
      .verifyWith((SecretKey) getSignKey())
      .build()
      .parseSignedClaims(token)
      .getPayload();
  }

  private Key getSignKey() {
    byte[] keyBytes = BASE64.decode(jwtTokenSecret);
    return hmacShaKeyFor(keyBytes);
  }

  private String createToken(Map<String, Object> claims, String idCode) {
    return Jwts.builder()
      .claims(claims)
      .subject(idCode)
      .issuedAt(new Date(currentTimeMillis()))
      .expiration(new Date(currentTimeMillis() + ACCESS_TOKEN_EXPIRES_IN_MILLISECONDS))
      .signWith(getSignKey())
      .compact();
  }
}
