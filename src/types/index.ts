// Job status enum
export enum JobStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    STOPPED = 'STOPPED'
  }
  
  // Job configuration interface
  export interface JobConfig {
    name?: string;
    env?: Record<string, string>;
    command?: string[];
    volumes?: string[];
    ports?: string[];
    resources?: {
      cpus?: number;
      memory?: string;
    };
  }
  
  // Job interface representing a container job
  export interface Job {
    id: string;
    name: string;
    image: string;
    status: JobStatus;
    created: string;
    started?: string;
    finished?: string;
    config: JobConfig;
  }
