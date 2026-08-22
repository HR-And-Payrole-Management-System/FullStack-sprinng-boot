package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.entity.Attendance;

public interface AttendanceCalculationService {

    void calculate(Attendance attendance);
}