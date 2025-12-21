package com.periodtracker

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class PeriodTrackerApplication

fun main(args: Array<String>) {
    runApplication<PeriodTrackerApplication>(*args)
}
