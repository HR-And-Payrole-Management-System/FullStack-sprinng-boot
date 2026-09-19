package com.hrms.hr_payroll_management_system.repository.okr;

import com.hrms.hr_payroll_management_system.entity.okr.Objective;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ObjectiveRepository extends JpaRepository<Objective, Long> {
    List<Objective> findByCycleId(Long cycleId);
    List<Objective> findByOwnerIdAndCycleId(Long ownerId, Long cycleId);
    List<Objective> findByParentObjectiveIsNullAndCycleId(Long cycleId); // top-level objectives for a cycle
}