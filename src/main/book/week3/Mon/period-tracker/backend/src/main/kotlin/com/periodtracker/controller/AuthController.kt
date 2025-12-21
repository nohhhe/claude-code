package com.periodtracker.controller

import com.periodtracker.dto.AuthResponse
import com.periodtracker.dto.LoginRequest
import com.periodtracker.dto.RegisterRequest
import com.periodtracker.service.AuthService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "인증 관련 API")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/register")
    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> {
        val response = authService.register(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "사용자 로그인을 처리합니다")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        val response = authService.login(request)
        return ResponseEntity.ok(response)
    }
}
