'use client';

import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default function QuillEditor({ value, onChange }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current) return;

        if (!quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: 'Write something amazing...',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
                        [{ size: [] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image', 'video'],
                        [{ align: [] }],
                        ['clean'],
                        ['code-block'],
                        [{ script: 'sub' }, { script: 'super' }],
                        [{ color: [] }, { background: [] }],
                    ],
                },
            });

            quillRef.current.on('text-change', () => {
                const html = editorRef.current.querySelector('.ql-editor').innerHTML;
                onChange(html);
            });
        }
    }, [onChange]);

    useEffect(() => {
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            quillRef.current.root.innerHTML = value || '';
        }
    }, [value]);

    return (
        <div>
            <div ref={editorRef} style={{ height: '300px' }} />
        </div>
    );
}
