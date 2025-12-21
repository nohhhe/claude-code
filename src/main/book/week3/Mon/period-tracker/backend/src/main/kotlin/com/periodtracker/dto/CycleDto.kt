package com.periodtracker.dto

import com.periodtracker.domain.FlowIntensity
import jakarta.validation.constraints.NotNull
import java.time.LocalDate

data class CreateCycleRequest(
    @field:NotNull(message = "시작일은 필수입니다")
    val startDate: LocalDate,

    val endDate: LocalDate? = null,

    val flowIntensity: FlowIntensity? = null,

    val symptoms: List<String> = emptyList(),

    val notes: String? = null
)

data class UpdateCycleRequest(
    val startDate: LocalDate? = null,
    val endDate: LocalDate? = null,
    val flowIntensity: FlowIntensity? = null,
    val symptoms: List<String>? = null,
    val notes: String? = null
)

data class CycleResponse(
    val id: Long,
    val startDate: LocalDate,
    val endDate: LocalDate?,
    val cycleLength: Int?,
    val periodLength: Int?,
    val flowIntensity: FlowIntensity?,
    val symptoms: List<String>,
    val notes: String?
)

data class CycleStatsResponse(
    val averageCycleLength: Double?,
    val averagePeriodLength: Double?,
    val nextPredictedStartDate: LocalDate?,
    val totalCycles: Int,
    val commonSymptoms: Map<String, Int>
)
