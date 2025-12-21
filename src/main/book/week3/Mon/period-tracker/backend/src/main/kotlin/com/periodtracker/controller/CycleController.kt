package com.periodtracker.controller

import com.periodtracker.dto.CreateCycleRequest
import com.periodtracker.dto.CycleResponse
import com.periodtracker.dto.CycleStatsResponse
import com.periodtracker.dto.UpdateCycleRequest
import com.periodtracker.security.UserPrincipal
import com.periodtracker.service.CycleService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/cycles")
@Tag(name = "Cycles", description = "월경 주기 관련 API")
@SecurityRequirement(name = "Bearer Authentication")
class CycleController(
    private val cycleService: CycleService
) {

    @PostMapping
    @Operation(summary = "주기 기록", description = "새로운 월경 주기를 기록합니다")
    fun createCycle(
        @AuthenticationPrincipal userPrincipal: UserPrincipal,
        @Valid @RequestBody request: CreateCycleRequest
    ): ResponseEntity<CycleResponse> {
        val response = cycleService.createCycle(userPrincipal.id, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @GetMapping
    @Operation(summary = "주기 목록 조회", description = "사용자의 모든 월경 주기를 조회합니다")
    fun getCycles(@AuthenticationPrincipal userPrincipal: UserPrincipal): ResponseEntity<List<CycleResponse>> {
        val cycles = cycleService.getCycles(userPrincipal.id)
        return ResponseEntity.ok(cycles)
    }

    @GetMapping("/{cycleId}")
    @Operation(summary = "주기 상세 조회", description = "특정 월경 주기의 상세 정보를 조회합니다")
    fun getCycleById(
        @AuthenticationPrincipal userPrincipal: UserPrincipal,
        @PathVariable cycleId: Long
    ): ResponseEntity<CycleResponse> {
        val cycle = cycleService.getCycleById(userPrincipal.id, cycleId)
        return ResponseEntity.ok(cycle)
    }

    @PutMapping("/{cycleId}")
    @Operation(summary = "주기 수정", description = "월경 주기 정보를 수정합니다")
    fun updateCycle(
        @AuthenticationPrincipal userPrincipal: UserPrincipal,
        @PathVariable cycleId: Long,
        @Valid @RequestBody request: UpdateCycleRequest
    ): ResponseEntity<CycleResponse> {
        val response = cycleService.updateCycle(userPrincipal.id, cycleId, request)
        return ResponseEntity.ok(response)
    }

    @DeleteMapping("/{cycleId}")
    @Operation(summary = "주기 삭제", description = "월경 주기 기록을 삭제합니다")
    fun deleteCycle(
        @AuthenticationPrincipal userPrincipal: UserPrincipal,
        @PathVariable cycleId: Long
    ): ResponseEntity<Void> {
        cycleService.deleteCycle(userPrincipal.id, cycleId)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/stats")
    @Operation(summary = "통계 조회", description = "월경 주기 통계를 조회합니다")
    fun getStats(@AuthenticationPrincipal userPrincipal: UserPrincipal): ResponseEntity<CycleStatsResponse> {
        val stats = cycleService.getStats(userPrincipal.id)
        return ResponseEntity.ok(stats)
    }
}
