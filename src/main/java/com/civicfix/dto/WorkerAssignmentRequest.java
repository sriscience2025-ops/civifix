package com.civicfix.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class WorkerAssignmentRequest {

    @NotNull(message = "Worker ID is required")
    private Long workerId;

    private String instructions;
    private LocalDateTime deadline;

    public WorkerAssignmentRequest() {}

    public Long getWorkerId() { return workerId; }
    public void setWorkerId(Long workerId) { this.workerId = workerId; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
}
