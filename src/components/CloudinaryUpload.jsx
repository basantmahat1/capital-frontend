import React, { useState } from 'react';

const CloudinaryUpload = ({ onUpload, multiple = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  const openCloudinaryWidget = async () => {
    try {
      setIsLoading(true);
      
      // Get signature from backend
      const response = await fetch('/api/cloudinary/signature', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      // Initialize Cloudinary widget
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: data.cloudName,
          uploadPreset: 'capitalit_preset', // You need to create this in Cloudinary dashboard
          multiple: multiple,
          cropping: true,
          croppingAspectRatio: 1,
          showCompletedButton: true,
          clientAllowedFormats: ['jpg', 'png', 'gif', 'webp'],
          maxFileSize: 5242880 // 5MB
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            onUpload(result.info);
            setIsLoading(false);
          } else if (error) {
            console.error('Upload error:', error);
            setIsLoading(false);
          }
        }
      );

      widget.open();
    } catch (error) {
      console.error('Error opening widget:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={openCloudinaryWidget}
      disabled={isLoading}
      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
    >
      {isLoading ? 'Loading...' : 'Choose Photo from Cloudinary'}
    </button>
  );
};

export default CloudinaryUpload;
