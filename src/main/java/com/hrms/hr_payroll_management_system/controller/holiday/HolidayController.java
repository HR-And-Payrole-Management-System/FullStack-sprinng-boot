
package com.hrms.hr_payroll_management_system.controller.holiday;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.holiday.CreateHolidayRequest;
import com.hrms.hr_payroll_management_system.dto.request.holiday.UpdateHolidayRequest;
import com.hrms.hr_payroll_management_system.dto.response.holiday.HolidayResponse;
import com.hrms.hr_payroll_management_system.service.holiday.HolidayService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/holidays")
@RequiredArgsConstructor
public class HolidayController {

    private final HolidayService holidayService;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('HOLIDAY_CREATE')"
    )
    public ResponseEntity<ApiResponse<HolidayResponse>> create(
            @Valid @RequestBody CreateHolidayRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse
                                .<HolidayResponse>builder()
                                .success(true)
                                .message(
                                        "Holiday created successfully."
                                )
                                .data(
                                        holidayService.create(request)
                                )
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('HOLIDAY_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<HolidayResponse>>
            > getAll() {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<HolidayResponse>>builder()
                        .success(true)
                        .message(
                                "Holidays retrieved successfully."
                        )
                        .data(
                                holidayService.getAll()
                        )
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('HOLIDAY_VIEW')"
    )
    public ResponseEntity<ApiResponse<HolidayResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<HolidayResponse>builder()
                        .success(true)
                        .message(
                                "Holiday retrieved successfully."
                        )
                        .data(
                                holidayService.getById(id)
                        )
                        .build()
        );
    }

    @GetMapping("/range")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('HOLIDAY_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<HolidayResponse>>
            > getByRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<HolidayResponse>>builder()
                        .success(true)
                        .message(
                                "Holidays retrieved successfully."
                        )
                        .data(
                                holidayService.getByDateRange(
                                        startDate,
                                        endDate
                                )
                        )
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('HOLIDAY_UPDATE')"
    )
    public ResponseEntity<ApiResponse<HolidayResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateHolidayRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<HolidayResponse>builder()
                        .success(true)
                        .message(
                                "Holiday updated successfully."
                        )
                        .data(
                                holidayService.update(
                                        id,
                                        request
                                )
                        )
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('HOLIDAY_DELETE')"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        holidayService.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}