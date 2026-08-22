package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.entity.Attendance;
import com.hrms.hr_payroll_management_system.entity.WorkSchedule;
import com.hrms.hr_payroll_management_system.enums.AttendanceStatus;
import com.hrms.hr_payroll_management_system.service.AttendanceCalculationService;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class AttendanceCalculationServiceImpl
        implements AttendanceCalculationService {

    @Override
    public void calculate(Attendance attendance) {

        // Cannot calculate without these values
        if (attendance.getCheckInTime() == null
                || attendance.getCheckOutTime() == null
                || attendance.getWorkSchedule() == null
                || attendance.getWorkDate() == null) {
            return;
        }

        WorkSchedule schedule =
                attendance.getWorkSchedule();

        LocalDateTime checkIn =
                attendance.getCheckInTime();

        LocalDateTime checkOut =
                attendance.getCheckOutTime();

        /*
         * ============================================================
         * 1. Calculate total worked time
         * ============================================================
         */
        long totalMinutes =
                Duration.between(
                        checkIn,
                        checkOut
                ).toMinutes();

        /*
         * Prevent negative worked minutes.
         */
        if (totalMinutes < 0) {
            totalMinutes = 0;
        }

        /*
         * ============================================================
         * 2. Calculate worked minutes
         * ============================================================
         *
         * Example:
         *
         * Check-in  = 08:00
         * Check-out = 17:00
         * Total     = 540 minutes
         * Break     = 60 minutes
         *
         * Worked    = 480 minutes
         */
        long breakMinutes =
                schedule.getBreakMinutes();

        long workedMinutes =
                Math.max(
                        0,
                        totalMinutes - breakMinutes
                );

        attendance.setWorkedMinutes(
                workedMinutes
        );

        /*
         * ============================================================
         * 3. Calculate expected start time
         * ============================================================
         */
        LocalDateTime expectedStart =
                LocalDateTime.of(
                        attendance.getWorkDate(),
                        schedule.getStartTime()
                );

        /*
         * ============================================================
         * 4. Calculate expected end time
         * ============================================================
         */
        LocalDateTime expectedEnd =
                buildExpectedEnd(
                        attendance,
                        schedule
                );

        /*
         * ============================================================
         * 5. Calculate late minutes
         * ============================================================
         */
        long lateMinutes = 0;

        if (checkIn.isAfter(expectedStart)) {

            lateMinutes =
                    Duration.between(
                            expectedStart,
                            checkIn
                    ).toMinutes();
        }

        /*
         * ============================================================
         * 6. Calculate early leave minutes
         * ============================================================
         */
        long earlyLeaveMinutes = 0;

        if (checkOut.isBefore(expectedEnd)) {

            earlyLeaveMinutes =
                    Duration.between(
                            checkOut,
                            expectedEnd
                    ).toMinutes();
        }

        /*
         * ============================================================
         * 7. Calculate overtime minutes
         * ============================================================
         */
        long overtimeMinutes = 0;

        if (checkOut.isAfter(expectedEnd)) {

            overtimeMinutes =
                    Duration.between(
                            expectedEnd,
                            checkOut
                    ).toMinutes();
        }

        /*
         * ============================================================
         * 8. Save calculated values
         * ============================================================
         */
        attendance.setLateMinutes(
                lateMinutes
        );

        attendance.setEarlyLeaveMinutes(
                earlyLeaveMinutes
        );

        attendance.setOvertimeMinutes(
                overtimeMinutes
        );

        /*
         * ============================================================
         * 9. Calculate expected working minutes
         * ============================================================
         */
        long expectedWorkingMinutes =
                getExpectedWorkingMinutes(
                        attendance,
                        schedule
                );

        /*
         * ============================================================
         * 10. Calculate attendance status
         * ============================================================
         *
         * Rule:
         *
         * worked > 0
         * AND
         * worked < 50% of expected
         *
         * => HALF_DAY
         *
         * Otherwise:
         *
         * late > 0
         * => LATE
         *
         * Otherwise:
         *
         * => PRESENT
         */

        if (workedMinutes > 0
                && workedMinutes < expectedWorkingMinutes / 2) {

            attendance.setStatus(
                    AttendanceStatus.HALF_DAY
            );

        } else if (lateMinutes > 0) {

            attendance.setStatus(
                    AttendanceStatus.LATE
            );

        } else {

            attendance.setStatus(
                    AttendanceStatus.PRESENT
            );
        }
    }

    /**
     * Calculate expected working minutes
     * based on the attendance work date.
     *
     * Example:
     *
     * Work date = 2026-08-16
     * Start     = 08:00
     * End       = 17:00
     * Break     = 60
     *
     * Expected = 480 minutes
     */
    private long getExpectedWorkingMinutes(
            Attendance attendance,
            WorkSchedule schedule
    ) {

        LocalDateTime start =
                LocalDateTime.of(
                        attendance.getWorkDate(),
                        schedule.getStartTime()
                );

        LocalDateTime end =
                LocalDateTime.of(
                        attendance.getWorkDate(),
                        schedule.getEndTime()
                );

        /*
         * Overnight shift.
         *
         * Example:
         *
         * Start = 22:00
         * End   = 06:00
         *
         * End must be next day.
         */
        if (!end.isAfter(start)) {

            end = end.plusDays(1);
        }

        long minutes =
                Duration.between(
                        start,
                        end
                ).toMinutes();

        long breakMinutes =
                schedule.getBreakMinutes();

        return Math.max(
                0,
                minutes - breakMinutes
        );
    }

    /**
     * Build expected end time.
     *
     * Supports normal and overnight shifts.
     */
    private LocalDateTime buildExpectedEnd(
            Attendance attendance,
            WorkSchedule schedule
    ) {

        LocalTime start =
                schedule.getStartTime();

        LocalTime end =
                schedule.getEndTime();

        LocalDateTime expectedEnd =
                LocalDateTime.of(
                        attendance.getWorkDate(),
                        end
                );

        /*
         * Overnight shift.
         *
         * Example:
         *
         * 22:00 -> 06:00
         */
        if (end.isBefore(start)) {

            expectedEnd =
                    expectedEnd.plusDays(1);
        }

        return expectedEnd;
    }
}