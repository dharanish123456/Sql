package com.nexorcrm.backend.service;

import com.nexorcrm.backend.dto.EmployeeRequest;
import com.nexorcrm.backend.dto.EmployeeResponse;
import com.nexorcrm.backend.entity.Employee;
import com.nexorcrm.backend.repo.EmployeeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<EmployeeResponse> list() {
        return employeeRepository.findByDeletedFalseOrderByIdDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public EmployeeResponse create(EmployeeRequest request) {
        Employee e = new Employee();
        apply(e, request);
        e = employeeRepository.save(e);

        if (e.getEmployeeCode() == null || e.getEmployeeCode().isBlank()) {
            e.setEmployeeCode(String.format("Emp-%03d", e.getId()));
            e = employeeRepository.save(e);
        }

        return toResponse(e);
    }

    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee e = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
        if (Boolean.TRUE.equals(e.getDeleted())) {
            throw new EntityNotFoundException("Employee not found");
        }

        apply(e, request);
        return toResponse(employeeRepository.save(e));
    }

    public void delete(Long id) {
        Employee e = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
        e.setDeleted(true);
        employeeRepository.save(e);
    }

    private void apply(Employee e, EmployeeRequest r) {
        e.setName(r.getName());
        e.setEmail(r.getEmail());
        e.setPhone(r.getPhone());
        e.setDept(r.getDept());
        e.setDesignation(r.getDesignation());
        e.setJoinDate(r.getJoinDate());
        e.setStatus(normalizeStatus(r.getStatus()));
        e.setImg((r.getImg() == null || r.getImg().isBlank()) ? "assets/img/users/user-32.jpg" : r.getImg());
    }

    private String normalizeStatus(String status) {
        String s = String.valueOf(status == null ? "ACTIVE" : status).trim().toUpperCase();
        return s.equals("INACTIVE") ? "INACTIVE" : "ACTIVE";
    }

    private EmployeeResponse toResponse(Employee e) {
        EmployeeResponse r = new EmployeeResponse();
        r.setId(e.getId());
        r.setEmployeeCode(e.getEmployeeCode());
        r.setName(e.getName());
        r.setEmail(e.getEmail());
        r.setPhone(e.getPhone());
        r.setDept(e.getDept());
        r.setDesignation(e.getDesignation());
        r.setJoinDate(e.getJoinDate());
        r.setStatus(e.getStatus());
        r.setImg(e.getImg());
        return r;
    }
}
