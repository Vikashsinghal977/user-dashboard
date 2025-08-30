'use client';
import { fetchApi } from '@/services/utlis/fetchApi';
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import 'react-quill/dist/quill.snow.css';

// Use dynamic import with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface CustomTextEditorProps {
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

// Define colors outside component to avoid recreation
const customColors = [
  '#000000',
  '#e60000',
  '#ff9900',
  '#ffff00',
  '#008a00',
  '#0066cc',
  '#35209F',
  '#ffffff',
  '#facccc',
  '#ffebcc',
  '#ffffcc',
  '#cce8cc',
  '#cce0f5',
  '#B767A2',
  '#bbbbbb',
  '#f06666',
  '#ffc266',
  '#ffff66',
  '#66b966',
  '#66a3e0',
  '#c285ff',
  '#888888',
  '#a10000',
  '#b26b00',
  '#b2b200',
  '#006100',
  '#0047b2',
  '#6b24b2',
  '#444444',
  '#5c0000',
  '#663d00',
  '#666600',
  '#003700',
  '#002966',
  '#3d1466'
];

// Define globally to avoid recreation in every component
let Quill: any = null;
let quillModules: any = null;
let imageUploadHandler: any = null;

// Create a shared image upload handler
const createImageHandler = () => {
  if (imageUploadHandler) return imageUploadHandler;

  imageUploadHandler = async function (this: any) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const fileType = file.type.startsWith('image/') && 'quill_image';
        const formData = new FormData();
        formData.append(`${fileType}`, file);

        try {
          const response = await fetchApi('/files', {
            method: 'POST',
            body: formData
          });

          if (response.success) {
            const imageUrl = response.result.quillImgURL;
            const range = this.quill.getSelection();
            this.quill.insertEmbed(range.index, 'image', imageUrl);
          } else {
            console.error('Image upload failed');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    };
  };

  return imageUploadHandler;
};

// Initialize Quill only once
const initializeQuill = async () => {
  if (quillModules) return quillModules;

  if (typeof window !== 'undefined') {
    // Import and register modules only once
    try {
      Quill = (await import('quill')).default;
      const ImageResize = (await import('quill-image-resize-module-react'))
        .default;
      Quill.register('modules/imageResize', ImageResize);

      // Create modules configuration
      quillModules = {
        toolbar: {
          container: [
            [{ font: [] }, { size: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: customColors }, { background: customColors }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ header: '1' }, { header: '2' }, 'blockquote', 'code-block'],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' }
            ],
            [{ direction: 'rtl' }],
            ['link', 'image', 'video', 'formula'],
            [{ align: [] }],
            ['clean']
          ],
          handlers: {
            image: createImageHandler()
          }
        },
        imageResize: {
          parchment: Quill.import('parchment'),
          modules: ['Resize', 'DisplaySize']
        }
      };

      return quillModules;
    } catch (error) {
      console.error('Error initializing Quill:', error);
      return null;
    }
  }

  return null;
};

// Memoized editor component with stable callbacks
const CustomTextEditor = memo(
  ({
    name,
    label,
    placeholder = 'Write Something Here...',
    value = '',
    required = false,
    className = '',
    onChange
  }: CustomTextEditorProps) => {
    const [ready, setReady] = useState(false);
    const editorRef = useRef<any>(null);
    const valueRef = useRef(value);

    // Track value changes to avoid unnecessary re-renders
    useEffect(() => {
      valueRef.current = value;
    }, [value]);

    // Initialize Quill only once
    useEffect(() => {
      let mounted = true;

      const setup = async () => {
        await initializeQuill();
        if (mounted) setReady(true);
      };

      setup();

      return () => {
        mounted = false;
      };
    }, []);

    // Stable onChange handler
    const handleChange = useCallback(
      (content: string) => {
        if (onChange && content !== valueRef.current) {
          onChange(content);
        }
      },
      [onChange]
    );

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-600"> *</span>}
          </label>
        )}

        {ready && (
          <ReactQuill
            // ref={editorRef}
            id={name}
            theme="snow"
            modules={quillModules}
            placeholder={placeholder}
            value={value || ''}
            onChange={handleChange}
            className={`quill-editor ${className}`}
          />
        )}
      </div>
    );
  }
);

// Add display name to avoid React warnings
CustomTextEditor.displayName = 'CustomTextEditor';

export default CustomTextEditor;
