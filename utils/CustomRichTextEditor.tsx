'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchSetting } from '@/redux/slices/settingSlice';

interface CustomRichTextEditorProps {
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  height?: number;
}

const CustomRichTextEditor = ({
  name,
  label,
  placeholder = 'Write something here...',
  value = '',
  required = false,
  className = '',
  onChange,
  height = 500
}: CustomRichTextEditorProps) => {
  const editorRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const { settingState } = useAppSelector((state) => state.settings);
  const { data: settingData, loading, error } = settingState;

  const [editorContent, setEditorContent] = useState(value);
  const hasInitializedRef = useRef(false);

  // Memoized API key extraction
  const apiKey = React.useMemo(() => {
    return settingData?.general?.tinyMCEKey || null;
  }, [settingData?.general?.tinyMCEKey]);

  // Fetch settings only once
  useEffect(() => {
    if (!hasInitializedRef.current && !loading && !settingData) {
      dispatch(fetchSetting(null));
      hasInitializedRef.current = true;
    }
  }, [dispatch, loading, settingData]);

  // Update content when value prop changes
  useEffect(() => {
    if (value !== editorContent) {
      setEditorContent(value);
    }
  }, [value, editorContent]);

  // Memoized editor change handler to prevent unnecessary re-renders
  const handleEditorChange = useCallback(
    (content: string) => {
      setEditorContent(content);
      onChange?.(content);
    },
    [onChange]
  );

  console.log(
    'The settingData value is in the TinyMCE Editor is:',
    settingData
  );

  // Show loading state
  if (loading && !settingData) {
    return (
      <div className={`tinymce-editor-wrapper ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-600"> *</span>}
          </label>
        )}
        <div className="flex items-center justify-center rounded-md border border-gray-300 p-4">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`tinymce-editor-wrapper ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-600"> *</span>}
          </label>
        )}
        <div className="flex items-center justify-center rounded-md border border-red-300 bg-red-50 p-4">
          <div className="text-red-500">Error loading editor settings</div>
        </div>
      </div>
    );
  }

  // Show message if API key is not available
  if (settingData && !apiKey) {
    return (
      <div className={`tinymce-editor-wrapper ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-600"> *</span>}
          </label>
        )}
        <div className="flex items-center justify-center rounded-md border border-yellow-300 bg-yellow-50 p-4">
          <div className="text-yellow-700">TinyMCE API key not configured</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`tinymce-editor-wrapper ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}

      {apiKey && (
        <Editor
          id={name}
          apiKey={apiKey}
          onInit={(evt: any, editor: any) => {
            editorRef.current = editor;
          }}
          value={editorContent}
          onEditorChange={handleEditorChange}
          init={{
            height,
            menubar: true,
            branding: false,
            statusbar: false,
            placeholder,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'help',
              'wordcount',
              'codesample',
              'emoticons'
            ],
            toolbar:
              'undo redo | styles | fontfamily fontsize | ' +
              'bold italic underline strikethrough | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'forecolor backcolor | link image media | codesample emoticons | ' +
              'removeformat code fullscreen help',
            content_style: `
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size: 16px; line-height: 1.6; }
              .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before { color: #aaa; }
            `,
            font_family_formats:
              'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; ' +
              'Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; ' +
              'Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Roboto=roboto,sans-serif; ' +
              'Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; ' +
              'Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; ' +
              'Montserrat=montserrat,sans-serif; Open Sans=open sans,sans-serif; Lato=lato,sans-serif',
            font_size_formats:
              '8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 28pt 36pt 48pt 72pt',
            images_upload_handler: (blobInfo: any, progress: any) => {
              return new Promise((resolve, reject) => {
                // This is a simple example. You should implement your own image upload handler
                const reader = new FileReader();
                reader.onload = (e) => {
                  if (e.target) {
                    // In a real application, you would upload this to your server
                    // and return the URL of the uploaded image
                    resolve(e.target.result as string);
                  } else {
                    reject('Failed to read file');
                  }
                };
                reader.readAsDataURL(blobInfo.blob());
              });
            },
            paste_data_images: true,
            paste_as_text: false,
            browser_spellcheck: true,
            contextmenu: false,
            setup: function (editor: any) {
              // Add HTML source code editing button
              editor.ui.registry.addButton('code', {
                icon: 'sourcecode',
                tooltip: 'Source code',
                onAction: function () {
                  editor.setContent(editor.getContent({ format: 'html' }));
                  editor.focus();
                }
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default CustomRichTextEditor;
