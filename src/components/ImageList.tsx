// src/components/ImageList.tsx
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

interface ImageListProps {
  onSelectImage: (image: string) => void;
}

export function ImageList({ onSelectImage }: ImageListProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      setError('Failed to load images. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading images...</div>;
  }

  return (
    <div>
      <div className="flex-row space-between">
        <h2>Available Images</h2>
        <button onClick={loadImages}>Refresh</button>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {images.length === 0 ? (
        <p>No images available on the server.</p>
      ) : (
        <div className="image-list">
          {images.map((image) => (
            <div
              key={image}
              className="card"
              onClick={() => onSelectImage(image)}
              style={{ cursor: 'pointer' }}
            >
              <div className="flex-row space-between">
                <div>
                  <h3>{image}</h3>
                </div>
                <button onClick={(e) => {
                  e.stopPropagation();
                  onSelectImage(image);
                }}>
                  Create Job
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}