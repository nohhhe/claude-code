package com.periodtracker.security

import com.periodtracker.repository.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    private val userRepository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByEmail(username)
            .orElseThrow { UsernameNotFoundException("사용자를 찾을 수 없습니다: $username") }

        return UserPrincipal(
            id = user.id!!,
            email = user.email,
            password = user.password
        )
    }
}
