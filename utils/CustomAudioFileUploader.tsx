'use client';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';

interface CustomAudioFileUploaderProps {
  value?: string | File | null;
  onValueChange?: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
}

const CustomAudioFileUploader: React.FC<CustomAudioFileUploaderProps> = ({
  value,
  onValueChange,
  accept = 'audio/*',
  maxSize = 1024 * 1024 * 20
}) => {
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle existing audio URL (for update case)
  useEffect(() => {
    if (typeof value === 'string' && value.trim() !== '') {
      setAudioPreview(value); // Set preview to the existing audio URL
    } else if (value instanceof File) {
      setAudioPreview(URL.createObjectURL(value)); // Generate preview for uploaded file
    } else {
      setAudioPreview(null);
    }
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > maxSize) {
        alert(`File size exceeds the limit of ${maxSize / (1024 * 1024)} MB.`);
        return;
      }
      setAudioPreview(URL.createObjectURL(file));
      onValueChange?.(file);
    } else {
      setAudioPreview(null);
      onValueChange?.(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setAudioPreview(null);
    onValueChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-3 space-y-4">
      {/* <label className="text-sm font-medium text-muted-foreground">
        Upload Audio File
      </label> */}

      <Button variant="outline" type="button" onClick={handleButtonClick}>
        Select Audio File
      </Button>

      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      {audioPreview && (
        <div className="flex flex-col items-start gap-3 space-y-2">
          <p className="text-sm text-muted-foreground">Preview:</p>
          <audio
            controls
            controlsList="nodownload"
            src={audioPreview}
            className="w-full rounded-md border border-muted-foreground/30 p-2"
          >
            Your browser does not support the audio element.
          </audio>
          <Button
            variant="outline"
            type="button"
            className="bg-red-500 text-white hover:bg-red-600 hover:text-gray-500"
            onClick={handleRemove}
          >
            Remove Audio
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomAudioFileUploader;
