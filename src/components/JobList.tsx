// src/components/JobList.tsx
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Job, JobStatus } from '../types';

interface JobListProps {
  onSelectJob: (job: Job) => void;
}

export function JobList({ onSelectJob }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load jobs when component mounts
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getJobs();
      setJobs(data);
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestartJob = async (jobId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await apiClient.restartJob(jobId);
      // Refresh job list after restart
      loadJobs();
    } catch (err) {
      setError('Failed to restart job. Please try again.');
      console.error(err);
    }
  };

  const handleStopJob = async (jobId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await apiClient.stopJob(jobId);
      // Refresh job list after stop
      loadJobs();
    } catch (err) {
      setError('Failed to stop job. Please try again.');
      console.error(err);
    }
  };

  // Helper function to get badge class based on job status
  const getStatusBadgeClass = (status: JobStatus) => {
    switch (status) {
      case JobStatus.PENDING:
        return 'pending';
      case JobStatus.RUNNING:
        return 'running';
      case JobStatus.COMPLETED:
        return 'completed';
      case JobStatus.FAILED:
        return 'failed';
      case JobStatus.STOPPED:
        return 'stopped';
      default:
        return '';
    }
  };

  // Format date string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  return (
    <div>
      <div className="flex-row space-between">
        <h2>Job List</h2>
        <button onClick={loadJobs}>Refresh</button>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {jobs.length === 0 ? (
        <p>No jobs found. Create a new job to get started.</p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="card"
              onClick={() => onSelectJob(job)}
              style={{ cursor: 'pointer' }}
            >
              <div className="flex-row space-between">
                <div>
                  <h3>{job.name || 'Unnamed Job'}</h3>
                  <p>ID: {job.id}</p>
                  <p>Image: {job.image}</p>
                  <p>Created: {formatDate(job.created)}</p>
                </div>
                <div className="flex-column">
                  <span className={`status-badge ${getStatusBadgeClass(job.status)}`}>
                    {job.status}
                  </span>
                  <div className="flex-row">
                    {job.status === JobStatus.RUNNING && (
                      <button 
                        className="danger"
                        onClick={(e) => handleStopJob(job.id, e)}
                      >
                        Stop
                      </button>
                    )}
                    {(job.status === JobStatus.STOPPED || job.status === JobStatus.FAILED) && (
                      <button 
                        onClick={(e) => handleRestartJob(job.id, e)}
                      >
                        Restart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}