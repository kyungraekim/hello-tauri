// src/App.tsx
import { useState, useEffect } from 'react';
import './App.css';
import { JobList } from './components/JobList';
import { ImageList } from './components/ImageList';
import { JobDetail } from './components/JobDetail';
import { CreateJob } from './components/CreateJob';
import { Settings } from './components/Settings';
import { Job } from './types';
import { useApiContext } from './context/ApiContext';
import { updateApiBaseUrl } from './api/client';

function App() {
  // Get API context values
  const { apiUrl, useMockApi } = useApiContext();
  
  // State for navigation and selected job
  const [page, setPage] = useState<'jobs' | 'images' | 'create' | 'detail' | 'settings'>('jobs');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Update API URL when it changes in context
  useEffect(() => {
    updateApiBaseUrl(apiUrl);
  }, [apiUrl]);

  // Navigation functions
  const navigateToJobs = () => {
    setPage('jobs');
    setSelectedJob(null);
  };

  const navigateToImages = () => {
    setPage('images');
    setSelectedJob(null);
  };

  const navigateToCreate = (image?: string) => {
    if (image) {
      setSelectedImage(image);
    }
    setPage('create');
    setSelectedJob(null);
  };
  
  const navigateToSettings = () => {
    setPage('settings');
    setSelectedJob(null);
  };

  const navigateToDetail = (job: Job) => {
    setSelectedJob(job);
    setPage('detail');
  };

  return (
    <div className="container">
      <header>
        <h1>Container Job Manager</h1>
        {/* API Mode Indicator */}
        <div className="api-mode-indicator">
          {useMockApi ? (
            <>
              <span className="status-badge warning">Mode: MOCK API</span>
              <span className="status-badge pending">Using sample data</span>
            </>
          ) : (
            <>
              <span className="status-badge completed">Mode: REAL API</span>
              <span className="status-badge running">{apiUrl}</span>
            </>
          )}
        </div>
        <nav>
          <button 
            className={page === 'jobs' ? 'active' : ''} 
            onClick={navigateToJobs}
          >
            Jobs
          </button>
          <button 
            className={page === 'images' ? 'active' : ''} 
            onClick={navigateToImages}
          >
            Images
          </button>
          <button 
            className={page === 'create' ? 'active' : ''} 
            onClick={() => navigateToCreate()}
          >
            Create Job
          </button>
          <button 
            className={page === 'settings' ? 'active' : ''} 
            onClick={navigateToSettings}
          >
            Settings
          </button>
        </nav>
      </header>

      <main>
        {useMockApi && page !== 'settings' && (
          <div className="mock-mode-notice">
            <p>
              <strong>Mock Mode Active:</strong> Using sample data for testing. No real API calls are being made.
              <button onClick={navigateToSettings} className="text-button">Switch to real API</button>
            </p>
          </div>
        )}
        
        {page === 'jobs' && <JobList onSelectJob={navigateToDetail} />}
        {page === 'images' && <ImageList onSelectImage={(image) => navigateToCreate(image)} />}
        {page === 'create' && <CreateJob onCreated={navigateToJobs} preselectedImage={selectedImage} />}
        {page === 'detail' && selectedJob && (
          <JobDetail 
            jobId={selectedJob.id} 
            onBack={navigateToJobs} 
          />
        )}
        {page === 'settings' && <Settings onSaved={navigateToJobs} />}
      </main>
    </div>
  );
}

export default App;