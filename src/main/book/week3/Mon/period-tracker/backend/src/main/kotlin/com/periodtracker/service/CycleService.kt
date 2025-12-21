package com.periodtracker.service

import com.periodtracker.domain.Cycle
import com.periodtracker.dto.CreateCycleRequest
import com.periodtracker.dto.CycleResponse
import com.periodtracker.dto.CycleStatsResponse
import com.periodtracker.dto.UpdateCycleRequest
import com.periodtracker.repository.CycleRepository
import com.periodtracker.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.temporal.ChronoUnit

@Service
class CycleService(
    private val cycleRepository: CycleRepository,
    private val userRepository: UserRepository
) {

    @Transactional
    fun createCycle(userId: Long, request: CreateCycleRequest): CycleResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { IllegalArgumentException("사용자를 찾을 수 없습니다") }

        // Calculate cycle length based on previous cycle (must be before this cycle's start date)
        val previousCycle = cycleRepository.findFirstByUserIdAndStartDateBeforeOrderByStartDateDesc(
            userId, request.startDate
        )

        val cycleLength = previousCycle?.let {
            ChronoUnit.DAYS.between(it.startDate, request.startDate).toInt()
        }?.takeIf { it > 0 }  // 음수면 null로 처리

        val cycle = Cycle(
            user = user,
            startDate = request.startDate,
            endDate = request.endDate,
            flowIntensity = request.flowIntensity,
            notes = request.notes,
            symptoms = request.symptoms.toMutableList(),
            periodLength = request.endDate?.let {
                ChronoUnit.DAYS.between(request.startDate, it).toInt() + 1
            },
            cycleLength = cycleLength
        )

        val savedCycle = cycleRepository.save(cycle)
        return savedCycle.toResponse()
    }

    fun getCycles(userId: Long): List<CycleResponse> {
        return cycleRepository.findByUserIdOrderByStartDateDesc(userId)
            .map { it.toResponse() }
    }

    fun getCycleById(userId: Long, cycleId: Long): CycleResponse {
        val cycle = cycleRepository.findById(cycleId)
            .orElseThrow { IllegalArgumentException("주기를 찾을 수 없습니다") }

        if (cycle.user.id != userId) {
            throw IllegalArgumentException("권한이 없습니다")
        }

        return cycle.toResponse()
    }

    @Transactional
    fun updateCycle(userId: Long, cycleId: Long, request: UpdateCycleRequest): CycleResponse {
        val cycle = cycleRepository.findById(cycleId)
            .orElseThrow { IllegalArgumentException("주기를 찾을 수 없습니다") }

        if (cycle.user.id != userId) {
            throw IllegalArgumentException("권한이 없습니다")
        }

        val updatedCycle = cycle.copy(
            startDate = request.startDate ?: cycle.startDate,
            endDate = request.endDate ?: cycle.endDate,
            flowIntensity = request.flowIntensity ?: cycle.flowIntensity,
            symptoms = request.symptoms?.toMutableList() ?: cycle.symptoms,
            notes = request.notes ?: cycle.notes,
            periodLength = request.endDate?.let {
                ChronoUnit.DAYS.between(request.startDate ?: cycle.startDate, it).toInt() + 1
            } ?: cycle.periodLength
        )

        val savedCycle = cycleRepository.save(updatedCycle)
        return savedCycle.toResponse()
    }

    @Transactional
    fun deleteCycle(userId: Long, cycleId: Long) {
        val cycle = cycleRepository.findById(cycleId)
            .orElseThrow { IllegalArgumentException("주기를 찾을 수 없습니다") }

        if (cycle.user.id != userId) {
            throw IllegalArgumentException("권한이 없습니다")
        }

        cycleRepository.delete(cycle)
    }

    fun getStats(userId: Long): CycleStatsResponse {
        val cycles = cycleRepository.findByUserIdOrderByStartDateDesc(userId)

        if (cycles.isEmpty()) {
            return CycleStatsResponse(
                averageCycleLength = null,
                averagePeriodLength = null,
                nextPredictedStartDate = null,
                totalCycles = 0,
                commonSymptoms = emptyMap()
            )
        }

        // 날짜 오름차순으로 정렬하여 주기 길이 동적 계산
        val sortedCycles = cycles.sortedBy { it.startDate }
        val cycleLengths = sortedCycles.zipWithNext { prev, curr ->
            ChronoUnit.DAYS.between(prev.startDate, curr.startDate).toInt()
        }.filter { it > 0 }

        val periodLengths = cycles.mapNotNull { it.periodLength }

        val avgCycleLength = if (cycleLengths.isNotEmpty()) {
            cycleLengths.average()
        } else null

        val avgPeriodLength = if (periodLengths.isNotEmpty()) {
            periodLengths.average()
        } else null

        // 가장 최근 주기 기준으로 다음 예정일 계산
        val latestCycle = cycles.first() // 이미 내림차순 정렬됨
        val nextPredictedStartDate = avgCycleLength?.let {
            latestCycle.startDate.plusDays(it.toLong())
        }

        val allSymptoms = cycles.flatMap { it.symptoms }
        val symptomCounts = allSymptoms.groupingBy { it }.eachCount()

        return CycleStatsResponse(
            averageCycleLength = avgCycleLength,
            averagePeriodLength = avgPeriodLength,
            nextPredictedStartDate = nextPredictedStartDate,
            totalCycles = cycles.size,
            commonSymptoms = symptomCounts
        )
    }

    private fun Cycle.toResponse() = CycleResponse(
        id = id!!,
        startDate = startDate,
        endDate = endDate,
        cycleLength = cycleLength,
        periodLength = periodLength,
        flowIntensity = flowIntensity,
        symptoms = symptoms,
        notes = notes
    )
}
