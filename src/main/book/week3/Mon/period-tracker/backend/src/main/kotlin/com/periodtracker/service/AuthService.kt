package com.periodtracker.service

import com.periodtracker.domain.User
import com.periodtracker.dto.AuthResponse
import com.periodtracker.dto.LoginRequest
import com.periodtracker.dto.RegisterRequest
import com.periodtracker.dto.UserResponse
import com.periodtracker.repository.UserRepository
import com.periodtracker.security.JwtTokenProvider
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager,
    private val jwtTokenProvider: JwtTokenProvider
) {

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw IllegalArgumentException("이미 사용 중인 이메일입니다")
        }

        val user = User(
            email = request.email,
            password = passwordEncoder.encode(request.password),
            name = request.name,
            birthDate = request.birthDate
        )

        val savedUser = userRepository.save(user)

        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email, request.password)
        )

        val token = jwtTokenProvider.generateToken(authentication)

        return AuthResponse(
            token = token,
            user = savedUser.toUserResponse()
        )
    }

    fun login(request: LoginRequest): AuthResponse {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email, request.password)
        )

        val token = jwtTokenProvider.generateToken(authentication)

        val user = userRepository.findByEmail(request.email)
            .orElseThrow { IllegalArgumentException("사용자를 찾을 수 없습니다") }

        return AuthResponse(
            token = token,
            user = user.toUserResponse()
        )
    }

    private fun User.toUserResponse() = UserResponse(
        id = id!!,
        email = email,
        name = name,
        birthDate = birthDate
    )
}
