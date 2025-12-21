package com.periodtracker.domain

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "cycles")
data class Cycle(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @Column(name = "start_date", nullable = false)
    val startDate: LocalDate,

    @Column(name = "end_date")
    val endDate: LocalDate? = null,

    @Column(name = "cycle_length")
    val cycleLength: Int? = null,

    @Column(name = "period_length")
    val periodLength: Int? = null,

    @Column(columnDefinition = "TEXT")
    val notes: String? = null,

    @ElementCollection
    @CollectionTable(name = "cycle_symptoms", joinColumns = [JoinColumn(name = "cycle_id")])
    @Column(name = "symptom")
    val symptoms: MutableList<String> = mutableListOf(),

    @Enumerated(EnumType.STRING)
    @Column(name = "flow_intensity")
    val flowIntensity: FlowIntensity? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now()
)

enum class FlowIntensity {
    LIGHT,
    MEDIUM,
    HEAVY,
    SPOTTING
}
