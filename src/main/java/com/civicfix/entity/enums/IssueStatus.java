package com.civicfix.entity.enums;

public enum IssueStatus {
    SUBMITTED,
    UNDER_REVIEW,
    ASSIGNED,
    IN_PROGRESS,
    RESOLVED,
    VERIFICATION_PENDING,
    CLOSED,
    REOPENED,
    REJECTED,
    CANCELLED;

    public boolean isValidNextStatus(IssueStatus next) {
        switch (this) {
            case SUBMITTED:
                return next == UNDER_REVIEW || next == REJECTED || next == CANCELLED;
            case UNDER_REVIEW:
                return next == ASSIGNED || next == REJECTED || next == CANCELLED;
            case ASSIGNED:
                return next == IN_PROGRESS || next == UNDER_REVIEW || next == REJECTED;
            case IN_PROGRESS:
                return next == RESOLVED || next == ASSIGNED;
            case RESOLVED:
                return next == VERIFICATION_PENDING || next == CLOSED;
            case VERIFICATION_PENDING:
                return next == CLOSED || next == REOPENED;
            case REOPENED:
                return next == UNDER_REVIEW || next == ASSIGNED;
            case CLOSED:
            case REJECTED:
            case CANCELLED:
                return false;
            default:
                return false;
        }
    }
}
