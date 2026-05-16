export enum JobStatus {
    ASSIGNED = 'ASSIGNED',
    PROVIDER_ON_THE_WAY = 'PROVIDER_ON_THE_WAY',
    PROVIDER_ARRIVED = 'PROVIDER_ARRIVED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

/**
 * Strict state machine: defines which transitions are valid and who can trigger them.
 * Provider-owned transitions except CANCELLED which both parties can trigger.
 */
export const JOB_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
    [JobStatus.ASSIGNED]: [JobStatus.PROVIDER_ON_THE_WAY, JobStatus.CANCELLED],
    [JobStatus.PROVIDER_ON_THE_WAY]: [JobStatus.PROVIDER_ARRIVED, JobStatus.CANCELLED],
    [JobStatus.PROVIDER_ARRIVED]: [JobStatus.IN_PROGRESS],
    [JobStatus.IN_PROGRESS]: [JobStatus.COMPLETED],
    [JobStatus.COMPLETED]: [],
    [JobStatus.CANCELLED]: [],
};
