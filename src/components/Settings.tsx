// src/components/Settings.tsx
import { useState } from 'react';
import { useApiContext } from '../context/ApiContext';

interface SettingsProps {
  onSaved: () => void;
}

export function Settings({ onSaved }: SettingsProps) {
  const { apiUrl, setApiUrl, useMockApi, setUseMockApi } = useApiContext();
  const [newApiUrl, setNewApiUrl] = useState(apiUrl);
  const [mockApi, setMockApi] = useState(useMockApi);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    try {
      // Only validate URL if we're not using mock API
      if (!mockApi) {
        // Basic URL validation
        if (!newApiUrl.trim()) {
          setError('API URL cannot be empty');
          return;
        }

        // Try to create a URL object to check validity
        try {
          new URL(newApiUrl);
        } catch (e) {
          setError('Please enter a valid URL');
          return;
        }

        // Update the API URL
        setApiUrl(newApiUrl);
      }
      
      // Update mock API setting
      setUseMockApi(mockApi);
      
      setSaved(true);
      setError(null);
      
      // Navigate back after brief delay
      setTimeout(() => {
        onSaved();
      }, 1500);
    } catch (err) {
      setError('Failed to save settings');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      
      {error && <div className="error">{error}</div>}
      {saved && <div className="success">Settings saved successfully!</div>}
      
      <div className="form-group toggle-container">
        <label htmlFor="mockApi">Use Mock API (for testing)</label>
        <div className="toggle-switch">
          <input
            id="mockApi"
            type="checkbox"
            checked={mockApi}
            onChange={(e) => setMockApi(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </div>
        <p className="help-text">
          Enable to use mock data for testing. Disable to connect to a real API server.
        </p>
      </div>
      
      <div className="form-group" style={{ opacity: mockApi ? 0.5 : 1 }}>
        <label htmlFor="apiUrl">Job Server API URL</label>
        <input
          id="apiUrl"
          type="text"
          value={newApiUrl}
          onChange={(e) => setNewApiUrl(e.target.value)}
          placeholder="e.g. http://localhost:8080/api"
          disabled={mockApi}
        />
        <p className="help-text">
          Enter the base URL for the job server API. 
          Example: http://localhost:8080/api
        </p>
      </div>

      <div className="flex-row">
        <button type="button" className="secondary" onClick={onSaved}>
          Cancel
        </button>
        <button type="button" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
}