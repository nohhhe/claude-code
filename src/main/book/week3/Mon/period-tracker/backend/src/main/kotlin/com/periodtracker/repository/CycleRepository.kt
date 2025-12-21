package com.periodtracker.repository

import com.periodtracker.domain.Cycle
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface CycleRepository : JpaRepository<Cycle, Long> {
    fun findByUserIdOrderByStartDateDesc(userId: Long): List<Cycle>

    @Query("SELECT c FROM Cycle c WHERE c.user.id = :userId AND c.startDate >= :startDate AND c.startDate <= :endDate ORDER BY c.startDate DESC")
    fun findByUserIdAndDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<Cycle>

    fun findTop10ByUserIdOrderByStartDateDesc(userId: Long): List<Cycle>

    // 특정 날짜 이전의 가장 최근 주기를 찾음
    fun findFirstByUserIdAndStartDateBeforeOrderByStartDateDesc(userId: Long, startDate: LocalDate): Cycle?
}
