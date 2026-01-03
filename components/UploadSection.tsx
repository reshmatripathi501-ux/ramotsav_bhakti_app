
import React, { useState } from 'react';
import { Post, PostType } from '../types';

interface UploadSectionProps {
    onAddPost: (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments'>) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onAddPost }) => {
    const [mediaType, setMediaType] = useState<PostType>('video');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('Touch to Select File');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if ((mediaType !== 'news' && !file) || !title) {
            alert('Please fill in the title and select a file.');
            return;
        }
        if(mediaType === 'news' && !description){
            alert('Please fill in the Granth description.');
            return;
        }

        setIsUploading(true);
        // Simulate upload process
        setTimeout(() => {
            const url = file ? URL.createObjectURL(file) : 'https://picsum.photos/800/600';

            const newPost = {
                uploader: 'RamBhakt',
                type: mediaType,
                title,
                description,
                url,
            };

            onAddPost(newPost);
            
            // Reset form
            setTitle('');
            setDescription('');
            setFile(null);
            setFileName('Touch to Select File');
            setIsUploading(false);
            alert('Published Successfully!');
        }, 1500);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-cinzel text-center text-amber-400 mb-4">Upload Sewa</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select 
                    value={mediaType} 
                    onChange={e => setMediaType(e.target.value as PostType)}
                    className="w-full p-3 bg-[#222] border border-gray-600 rounded-lg text-white"
                >
                    <option value="video">Video</option>
                    <option value="image">Photo</option>
                    <option value="audio">Bhajan (Audio)</option>
                    <option value="news">Granth / News</option>
                </select>

                <input 
                    type="text" 
                    placeholder="Title (e.g. Morning Aarti)" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full p-3 bg-[#222] border border-gray-600 rounded-lg text-white"
                />

                {mediaType === 'news' && (
                    <textarea 
                        placeholder="Yahan Granth ya News likhein..." 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full p-3 bg-[#222] border border-gray-600 rounded-lg text-white h-32"
                    />
                )}

                <label htmlFor="fileInput" className="block cursor-pointer">
                    <div className="border-2 border-dashed border-amber-500 p-6 text-center rounded-lg text-gray-400">
                        <i className="fas fa-cloud-upload-alt text-4xl text-amber-500"></i>
                        <p className="mt-2 text-sm">{fileName}</p>
                    </div>
                </label>
                <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />

                <button 
                    type="submit" 
                    disabled={isUploading}
                    className="w-full p-4 bg-amber-500 text-black font-bold rounded-lg text-lg disabled:bg-gray-500"
                >
                    {isUploading ? 'Publishing...' : 'PUBLISH'}
                </button>
            </form>
        </div>
    );
};

export default UploadSection;
