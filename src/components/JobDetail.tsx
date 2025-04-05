// src/components/JobDetail.tsx
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Job, JobStatus } from '../types';

interface JobDetailProps {
  jobId: string;
  onBack: () => void;
}

export function JobDetail({ jobId, onBack }: JobDetailProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [logs, setLogs] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'details' | 'logs'>('details');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load job details and logs when component mounts or jobId changes
  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch job details
      const jobData = await apiClient.getJobById(jobId);
      setJob(jobData);
      
      // If active tab is logs, fetch logs as well
      if (activeTab === 'logs') {
        await loadJobLogs();
      }
    } catch (err) {
      setError('Failed to load job details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadJobLogs = async () => {
    try {
      setError(null);
      const logsData = await apiClient.getJobLogs(jobId);
      setLogs(logsData);
    } catch (err) {
      setError('Failed to load job logs. Please try again.');
      console.error(err);
    }
  };

  const handleTabChange = async (tab: 'details' | 'logs') => {
    setActiveTab(tab);
    if (tab === 'logs' && !logs) {
      await loadJobLogs();
    }
  };

  const handleRestartJob = async () => {
    try {
      setError(null);
      await apiClient.restartJob(jobId);
      // Refresh job details after restart
      loadJobDetails();
    } catch (err) {
      setError('Failed to restart job. Please try again.');
      console.error(err);
    }
  };

  const handleStopJob = async () => {
    try {
      setError(null);
      await apiClient.stopJob(jobId);
      // Refresh job details after stop
      loadJobDetails();
    } catch (err) {
      setError('Failed to stop job. Please try again.');
      console.error(err);
    }
  };

  // Format date string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Get status badge class
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

  if (loading) {
    return <div className="loading">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div>
        <button className="secondary" onClick={onBack}>Back to Jobs</button>
        <div className="error">Job not found or could not be loaded.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-row space-between">
        <button className="secondary" onClick={onBack}>Back to Jobs</button>
        <div className="flex-row">
          {job.status === JobStatus.RUNNING && (
            <button className="danger" onClick={handleStopJob}>Stop Job</button>
          )}
          {(job.status === JobStatus.STOPPED || job.status === JobStatus.FAILED) && (
            <button onClick={handleRestartJob}>Restart Job</button>
          )}
        </div>
      </div>

      <div className="job-detail">
        <h2>{job.name || 'Unnamed Job'}</h2>
        <div className="flex-row">
          <span className={`status-badge ${getStatusBadgeClass(job.status)}`}>
            {job.status}
          </span>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => handleTabChange('details')}
        >
          Details
        </div>
        <div 
          className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => handleTabChange('logs')}
        >
          Logs
        </div>
      </div>

      {activeTab === 'details' && (
        <div>
          <div className="card">
            <h3>Job Information</h3>
            <p><strong>ID:</strong> {job.id}</p>
            <p><strong>Image:</strong> {job.image}</p>
            <p><strong>Status:</strong> {job.status}</p>
            <p><strong>Created:</strong> {formatDate(job.created)}</p>
            <p><strong>Started:</strong> {formatDate(job.started)}</p>
            <p><strong>Finished:</strong> {formatDate(job.finished)}</p>
          </div>

          <div className="card">
            <h3>Configuration</h3>
            {job.config.command && (
              <p><strong>Command:</strong> {job.config.command.join(' ')}</p>
            )}
            
            {job.config.env && Object.keys(job.config.env).length > 0 && (
              <div>
                <p><strong>Environment Variables:</strong></p>
                <ul>
                  {Object.entries(job.config.env).map(([key, value]) => (
                    <li key={key}>{key}: {value}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.config.volumes && job.config.volumes.length > 0 && (
              <div>
                <p><strong>Volumes:</strong></p>
                <ul>
                  {job.config.volumes.map((volume, index) => (
                    <li key={index}>{volume}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.config.ports && job.config.ports.length > 0 && (
              <div>
                <p><strong>Ports:</strong></p>
                <ul>
                  {job.config.ports.map((port, index) => (
                    <li key={index}>{port}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.config.resources && (
              <div>
                <p><strong>Resources:</strong></p>
                <ul>
                  {job.config.resources.cpus && (
                    <li>CPUs: {job.config.resources.cpus}</li>
                  )}
                  {job.config.resources.memory && (
                    <li>Memory: {job.config.resources.memory}</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div>
          <div className="flex-row space-between">
            <h3>Logs</h3>
            <button className="secondary" onClick={loadJobLogs}>Refresh Logs</button>
          </div>
          <div className="log-container">
            {logs || 'No logs available yet.'}
          </div>
        </div>
      )}
    </div>
  );
}