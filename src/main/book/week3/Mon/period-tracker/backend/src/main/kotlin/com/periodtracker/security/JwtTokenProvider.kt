package com.periodtracker.security

import com.periodtracker.config.JwtProperties
import io.jsonwebtoken.*
import io.jsonwebtoken.security.Keys
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(
    private val jwtProperties: JwtProperties
) {
    private val secretKey: SecretKey = Keys.hmacShaKeyFor(jwtProperties.secret.toByteArray())

    fun generateToken(authentication: Authentication): String {
        val userPrincipal = authentication.principal as UserDetails
        val now = Date()
        val expiryDate = Date(now.time + jwtProperties.expiration)

        return Jwts.builder()
            .subject(userPrincipal.username)
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(secretKey)
            .compact()
    }

    fun getUsernameFromToken(token: String): String {
        val claims = Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .payload

        return claims.subject
    }

    fun validateToken(token: String): Boolean {
        try {
            Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
            return true
        } catch (ex: SecurityException) {
            // Invalid JWT signature
        } catch (ex: MalformedJwtException) {
            // Invalid JWT token
        } catch (ex: ExpiredJwtException) {
            // Expired JWT token
        } catch (ex: UnsupportedJwtException) {
            // Unsupported JWT token
        } catch (ex: IllegalArgumentException) {
            // JWT claims string is empty
        }
        return false
    }
}
