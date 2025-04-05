// src/mock/mockApiClient.ts
import { mockImages, mockJobs, mockLogs } from './data';
import { Job, JobStatus, JobConfig } from '../types';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Clone deep to avoid reference issues
const cloneDeep = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export class MockApiClient {
  private jobs: Job[] = cloneDeep(mockJobs);
  private images: string[] = [...mockImages];
  private logs: Record<string, string> = {...mockLogs};
  
  // Add random delay to simulate network latency
  private async simulateNetworkDelay<T>(data: T): Promise<T> {
    // Random delay between 200-800ms
    const latency = Math.floor(Math.random() * 600) + 200;
    await delay(latency);
    
    // 5% chance of simulating a network error
    if (Math.random() < 0.05) {
      throw new Error('Network error');
    }
    
    return data;
  }

  // Get list of available container images
  async getImages(): Promise<string[]> {
    return this.simulateNetworkDelay(this.images);
  }

  // Get list of jobs
  async getJobs(): Promise<Job[]> {
    return this.simulateNetworkDelay(this.jobs);
  }

  // Get job details by ID
  async getJobById(jobId: string): Promise<Job> {
    const job = this.jobs.find(j => j.id === jobId);
    
    if (!job) {
      throw new Error(`Job with ID ${jobId} not found`);
    }
    
    return this.simulateNetworkDelay(cloneDeep(job));
  }

  // Get job logs
  async getJobLogs(jobId: string): Promise<string> {
    if (!this.logs[jobId]) {
      // Generate some default logs if none exist
      this.logs[jobId] = `${new Date().toISOString()} [info] No detailed logs available for this job`;
    }
    
    return this.simulateNetworkDelay(this.logs[jobId]);
  }

  // Start a new job
  async startJob(image: string, config: JobConfig): Promise<Job> {
    // Generate a unique ID
    const id = (Math.max(0, ...this.jobs.map(j => parseInt(j.id))) + 1).toString();
    
    const now = new Date().toISOString();
    
    const newJob: Job = {
      id,
      name: config.name || `Job ${id}`,
      image,
      status: JobStatus.PENDING,
      created: now,
      started: now,
      config
    };
    
    // Add to jobs
    this.jobs.push(newJob);
    
    // After a delay, change status to RUNNING
    setTimeout(() => {
      const job = this.jobs.find(j => j.id === id);
      if (job) {
        job.status = JobStatus.RUNNING;
      }
    }, 3000);
    
    return this.simulateNetworkDelay(cloneDeep(newJob));
  }

  // Stop a job
  async stopJob(jobId: string): Promise<void> {
    const job = this.jobs.find(j => j.id === jobId);
    
    if (!job) {
      throw new Error(`Job with ID ${jobId} not found`);
    }
    
    if (job.status !== JobStatus.RUNNING && job.status !== JobStatus.PENDING) {
      throw new Error(`Cannot stop job with status ${job.status}`);
    }
    
    job.status = JobStatus.STOPPED;
    job.finished = new Date().toISOString();
    
    return this.simulateNetworkDelay(undefined);
  }

  // Restart a job
  async restartJob(jobId: string): Promise<Job> {
    const job = this.jobs.find(j => j.id === jobId);
    
    if (!job) {
      throw new Error(`Job with ID ${jobId} not found`);
    }
    
    if (job.status !== JobStatus.STOPPED && job.status !== JobStatus.FAILED && job.status !== JobStatus.COMPLETED) {
      throw new Error(`Cannot restart job with status ${job.status}`);
    }
    
    job.status = JobStatus.PENDING;
    job.started = new Date().toISOString();
    job.finished = undefined;
    
    // After a delay, change status to RUNNING
    setTimeout(() => {
      if (job.status === JobStatus.PENDING) {
        job.status = JobStatus.RUNNING;
      }
    }, 2000);
    
    return this.simulateNetworkDelay(cloneDeep(job));
  }
}

// Create and export a single instance of the mock API client
export const mockApiClient = new MockApiClient();