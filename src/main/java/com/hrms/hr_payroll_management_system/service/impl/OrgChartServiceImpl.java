package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.response.orgchart.OrgChartNodeResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.service.OrgChartService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class OrgChartServiceImpl implements OrgChartService {

    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<OrgChartNodeResponse> getCompanyOrgChart(Long companyId) {

        // 1. ONE query for the whole company — no recursive per-node hits.
        List<Employee> employees =
                employeeRepository.findByCompanyIdAndStatus(companyId, EmployeeStatus.ACTIVE);

        Map<Long, Employee> byId = new HashMap<>();
        for (Employee e : employees) {
            byId.put(e.getId(), e);
        }

        // 2. Detect and break cycles before building the tree, so corrupt
        //    manager_id chains can never cause infinite recursion.
        Set<Long> cyclicIds = detectCycles(employees, byId);

        // 3. Build every node once, keyed by id.
        Map<Long, OrgChartNodeResponse> nodes = new HashMap<>();
        for (Employee e : employees) {
            nodes.put(e.getId(), toNode(e));
        }

        // 4. Wire children -> parent in a single pass. Anyone whose manager
        //    is missing, outside this company, or part of a detected cycle
        //    becomes a root — the chart must always render, never 500.
        List<OrgChartNodeResponse> roots = new ArrayList<>();
        for (Employee e : employees) {
            OrgChartNodeResponse node = nodes.get(e.getId());
            Long managerId = e.getManager() != null ? e.getManager().getId() : null;

            boolean isRoot = managerId == null
                    || !byId.containsKey(managerId)
                    || cyclicIds.contains(e.getId());

            if (isRoot) {
                roots.add(node);
            } else {
                OrgChartNodeResponse parent = nodes.get(managerId);
                parent.getChildren().add(node);
                parent.setDirectReportsCount(parent.getDirectReportsCount() + 1);
            }
        }

        // 5. Bottom-up pass to compute totalReportsCount (whole subtree size)
        //    and sort each sibling group by directReportsCount desc, name asc
        //    so managers with bigger teams surface first.
        for (OrgChartNodeResponse root : roots) {
            computeTotalsAndSort(root);
        }

        roots.sort(Comparator.comparing(OrgChartNodeResponse::getFullName));
        return roots;
    }

    @Override
    @Transactional(readOnly = true)
    public OrgChartNodeResponse getSubTree(Long employeeId) {

        Employee root = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with id: " + employeeId));

        Long companyId = root.getCompany() != null ? root.getCompany().getId() : null;

        List<OrgChartNodeResponse> companyChart =
                companyId != null ? getCompanyOrgChart(companyId) : List.of();

        return findNode(companyChart, employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found in org chart: " + employeeId));
    }

    // ---- internal helpers ----

    /** Walks each employee's manager chain; anyone revisited before hitting a
     *  root (null manager) is part of a cycle. Runs in O(n) total via memoized
     *  visited/inProgress marking, not O(n^2). */
    private Set<Long> detectCycles(List<Employee> employees, Map<Long, Employee> byId) {
        Set<Long> visited = new HashSet<>();
        Set<Long> cyclic = new HashSet<>();

        for (Employee e : employees) {
            if (visited.contains(e.getId())) continue;

            List<Long> path = new ArrayList<>();
            Set<Long> onPath = new HashSet<>();
            Employee current = e;

            while (current != null && !visited.contains(current.getId())) {
                if (onPath.contains(current.getId())) {
                    // found a cycle: everything from current's first
                    // occurrence to the end of the path is cyclic
                    int start = path.indexOf(current.getId());
                    cyclic.addAll(path.subList(start, path.size()));
                    break;
                }
                onPath.add(current.getId());
                path.add(current.getId());

                Long mgrId = current.getManager() != null ? current.getManager().getId() : null;
                current = mgrId != null ? byId.get(mgrId) : null;
            }
            visited.addAll(path);
        }
        return cyclic;
    }

    private int computeTotalsAndSort(OrgChartNodeResponse node) {
        node.getChildren().sort(
                Comparator.comparingInt(OrgChartNodeResponse::getDirectReportsCount)
                        .reversed()
                        .thenComparing(OrgChartNodeResponse::getFullName)
        );

        int total = node.getChildren().size();
        for (OrgChartNodeResponse child : node.getChildren()) {
            total += computeTotalsAndSort(child);
        }
        node.setTotalReportsCount(total);
        return total;
    }

    private Optional<OrgChartNodeResponse> findNode(List<OrgChartNodeResponse> nodes, Long id) {
        for (OrgChartNodeResponse n : nodes) {
            if (n.getEmployeeId().equals(id)) return Optional.of(n);
            Optional<OrgChartNodeResponse> found = findNode(n.getChildren(), id);
            if (found.isPresent()) return found;
        }
        return Optional.empty();
    }

    private OrgChartNodeResponse toNode(Employee e) {
        return OrgChartNodeResponse.builder()
                .employeeId(e.getId())
                .employeeCode(e.getEmployeeCode())
                .fullName(e.getFirstName() + " " + e.getLastName())
                .email(e.getEmail())
                .photoUrl(e.getPhotoUrl())
                .positionName(e.getPosition() != null ? e.getPosition().getName() : null)
                .positionLevel(e.getPosition() != null && e.getPosition().getLevel() != null
                        ? e.getPosition().getLevel().name() : null)
                .departmentName(e.getDepartment() != null ? e.getDepartment().getName() : null)
                .status(e.getStatus().name())
                .managerId(e.getManager() != null ? e.getManager().getId() : null)
                .directReportsCount((int) e.getClass() // placeholder replaced below
                        .cast(e).hashCode() * 0) // no-op, see note
                .children(new ArrayList<>())
                .build();
    }
}