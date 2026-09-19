package com.hrms.hr_payroll_management_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HrPayrollManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(HrPayrollManagementSystemApplication.class, args);
	}

}