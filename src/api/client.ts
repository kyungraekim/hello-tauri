// src/api/client.ts
import { Job, JobStatus, JobConfig } from '../types';
import { mockApiClient } from '../mock/mockApiClient';

// Initialize with a default base URL, but will be updated from context
let API_BASE_URL = 'http://localhost:8080/api';
// Default to using mock API
let USE_MOCK_API = true;

// Function to update the API base URL
export function updateApiBaseUrl(url: string) {
  API_BASE_URL = url;
  console.log(`API base URL updated to: ${API_BASE_URL}`);
}

// Function to toggle between mock and real API
export function setUseMockApi(useMock: boolean) {
  USE_MOCK_API = useMock;
  console.log(`Using ${USE_MOCK_API ? 'mock' : 'real'} API client`);
}

// Real API client class for interacting with the job server
class RealApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Get list of available container images
  async getImages(): Promise<string[]> {
    return this.request<string[]>('/images');
  }

  // Get list of jobs
  async getJobs(): Promise<Job[]> {
    return this.request<Job[]>('/jobs');
  }

  // Get job details by ID
  async getJobById(jobId: string): Promise<Job> {
    return this.request<Job>(`/jobs/${jobId}`);
  }

  // Get job logs
  async getJobLogs(jobId: string): Promise<string> {
    return this.request<string>(`/jobs/${jobId}/logs`);
  }

  // Start a new job
  async startJob(image: string, config: JobConfig): Promise<Job> {
    return this.request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify({ image, ...config }),
    });
  }

  // Stop a job
  async stopJob(jobId: string): Promise<void> {
    return this.request<void>(`/jobs/${jobId}/stop`, {
      method: 'POST',
    });
  }

  // Restart a job
  async restartJob(jobId: string): Promise<Job> {
    return this.request<Job>(`/jobs/${jobId}/restart`, {
      method: 'POST',
    });
  }
}

// Create instance of real API client
const realApiClient = new RealApiClient();

// API client wrapper that switches between mock and real implementations
export const apiClient = {
  async getImages(): Promise<string[]> {
    return USE_MOCK_API ? mockApiClient.getImages() : realApiClient.getImages();
  },

  async getJobs(): Promise<Job[]> {
    return USE_MOCK_API ? mockApiClient.getJobs() : realApiClient.getJobs();
  },

  async getJobById(jobId: string): Promise<Job> {
    return USE_MOCK_API ? mockApiClient.getJobById(jobId) : realApiClient.getJobById(jobId);
  },

  async getJobLogs(jobId: string): Promise<string> {
    return USE_MOCK_API ? mockApiClient.getJobLogs(jobId) : realApiClient.getJobLogs(jobId);
  },

  async startJob(image: string, config: JobConfig): Promise<Job> {
    return USE_MOCK_API ? mockApiClient.startJob(image, config) : realApiClient.startJob(image, config);
  },

  async stopJob(jobId: string): Promise<void> {
    return USE_MOCK_API ? mockApiClient.stopJob(jobId) : realApiClient.stopJob(jobId);
  },

  async restartJob(jobId: string): Promise<Job> {
    return USE_MOCK_API ? mockApiClient.restartJob(jobId) : realApiClient.restartJob(jobId);
  }
};