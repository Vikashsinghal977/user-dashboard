import { fetchApi } from '@/services/utlis/fetchApi';

export const customColors = [
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

export const ReactQuillModules = {
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
      image: async function (this: any) {
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
      }
    },
    imageResize: {
      displayStyles: {
        backgroundColor: 'black',
        border: 'none',
        color: 'white'
      },
      modules: ['Resize', 'DisplaySize']
    }
  }
};
