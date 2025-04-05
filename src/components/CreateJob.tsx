// src/components/CreateJob.tsx
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { JobConfig } from '../types';

interface CreateJobProps {
  onCreated: () => void;
  preselectedImage?: string;
}

export function CreateJob({ onCreated, preselectedImage }: CreateJobProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedImage, setSelectedImage] = useState<string>(preselectedImage || '');
  const [name, setName] = useState<string>('');
  const [command, setCommand] = useState<string>('');
  const [env, setEnv] = useState<string>('');
  const [volumes, setVolumes] = useState<string>('');
  const [ports, setPorts] = useState<string>('');
  const [cpus, setCpus] = useState<string>('');
  const [memory, setMemory] = useState<string>('');

  // Load images when component mounts
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getImages();
      setImages(data);
      
      // If no image is preselected and we have images, select the first one
      if (!preselectedImage && data.length > 0 && !selectedImage) {
        setSelectedImage(data[0]);
      }
    } catch (err) {
      setError('Failed to load images. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      setError('Please select an image.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Parse environment variables from string to object
      const envVars: Record<string, string> = {};
      if (env.trim()) {
        env.split('\n').forEach(line => {
          const [key, value] = line.split('=');
          if (key && value) {
            envVars[key.trim()] = value.trim();
          }
        });
      }

      // Prepare job config
      const config: JobConfig = {
        name: name.trim() || undefined,
        command: command.trim() ? command.split(' ').filter(Boolean) : undefined,
        env: Object.keys(envVars).length > 0 ? envVars : undefined,
        volumes: volumes.trim() ? volumes.split('\n').map(v => v.trim()).filter(Boolean) : undefined,
        ports: ports.trim() ? ports.split('\n').map(p => p.trim()).filter(Boolean) : undefined,
        resources: {
          cpus: cpus.trim() ? parseFloat(cpus) : undefined,
          memory: memory.trim() ? memory : undefined,
        }
      };

      // Start the job
      await apiClient.startJob(selectedImage, config);
      onCreated();
    } catch (err) {
      setError('Failed to create job. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading available images...</div>;
  }

  return (
    <div>
      <h2>Create New Job</h2>
      
      {error && <div className="error">{error}</div>}
      
      {images.length === 0 ? (
        <p>No images available on the server.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="image">Container Image</label>
            <select
              id="image"
              value={selectedImage}
              onChange={(e) => setSelectedImage(e.target.value)}
              required
            >
              <option value="">Select an image</option>
              {images.map((image) => (
                <option key={image} value={image}>
                  {image}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Job Name (Optional)</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for the job"
            />
          </div>

          <div className="form-group">
            <label htmlFor="command">Command (Optional)</label>
            <input
              id="command"
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="e.g. npm start"
            />
          </div>

          <div className="form-group">
            <label htmlFor="env">Environment Variables (Optional - one per line, KEY=VALUE format)</label>
            <textarea
              id="env"
              value={env}
              onChange={(e) => setEnv(e.target.value)}
              placeholder="NODE_ENV=production&#10;DEBUG=false"
            />
          </div>

          <div className="form-group">
            <label htmlFor="volumes">Volumes (Optional - one per line)</label>
            <textarea
              id="volumes"
              value={volumes}
              onChange={(e) => setVolumes(e.target.value)}
              placeholder="/host/path:/container/path&#10;/data:/app/data"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ports">Ports (Optional - one per line)</label>
            <textarea
              id="ports"
              value={ports}
              onChange={(e) => setPorts(e.target.value)}
              placeholder="8080:80&#10;3000:3000"
            />
          </div>

          <div className="flex-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="cpus">CPUs (Optional)</label>
              <input
                id="cpus"
                type="number"
                step="0.1"
                min="0.1"
                value={cpus}
                onChange={(e) => setCpus(e.target.value)}
                placeholder="e.g. 1.0"
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="memory">Memory (Optional)</label>
              <input
                id="memory"
                type="text"
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                placeholder="e.g. 512m, 1g"
              />
            </div>
          </div>

          <div className="flex-row">
            <button type="button" className="secondary" onClick={() => onCreated()}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}