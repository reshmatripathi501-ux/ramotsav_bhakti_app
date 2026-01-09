import React, { useState } from 'react';
import { Post, PostType, User } from '../types';

interface UploadSectionProps {
    onAddPost: (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'views'>) => void;
    currentUser: User;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onAddPost, currentUser }) => {
    const [mediaType, setMediaType] = useState<PostType>('video');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(undefined);
    const [fileName, setFileName] = useState('Touch to Select File');
    const [thumbName, setThumbName] = useState('Select Cover Photo (Optional)');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (fileUrl && fileUrl.startsWith('blob:')) {
                URL.revokeObjectURL(fileUrl);
            }
            setFileUrl(URL.createObjectURL(file));
            setFileName(file.name);
        }
    };
    
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                setThumbnailUrl(loadEvent.target?.result as string);
                setThumbName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if ((mediaType !== 'news' && !fileUrl) || !title) {
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
            const newPost = {
                uploaderId: currentUser.id,
                type: mediaType,
                title,
                description,
                url: fileUrl || 'https://i.pinimg.com/originals/9e/11/a9/9e11a91c28c29b7a475514f762643793.jpg',
                thumbnailUrl,
            };

            onAddPost(newPost);
            
            // Reset form
            setTitle('');
            setDescription('');
            setFileUrl(null);
            setThumbnailUrl(undefined);
            setFileName('Touch to Select File');
            setThumbName('Select Cover Photo (Optional)');
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
                    className="w-full p-3 bg-gray-200 dark:bg-[#222] border border-gray-400 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
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
                    className="w-full p-3 bg-gray-200 dark:bg-[#222] border border-gray-400 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
                />

                <textarea 
                    placeholder="Description..." 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full p-3 bg-gray-200 dark:bg-[#222] border border-gray-400 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white h-24"
                />
                
                {mediaType !== 'news' && (
                    <label htmlFor="fileInput" className="block cursor-pointer">
                        <div className="border-2 border-dashed border-amber-500 p-6 text-center rounded-lg text-gray-500 dark:text-gray-400">
                            <i className="fas fa-cloud-upload-alt text-4xl text-amber-500"></i>
                            <p className="mt-2 text-sm">{fileName}</p>
                        </div>
                    </label>
                )}
                <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} accept={mediaType === 'video' ? 'video/*' : mediaType === 'image' ? 'image/*' : 'audio/*'} />

                {(mediaType === 'video' || mediaType === 'audio') && (
                     <label htmlFor="thumbInput" className="block cursor-pointer">
                        <div className="border-2 border-dashed border-gray-500 p-4 text-center rounded-lg text-gray-500 dark:text-gray-400">
                            <i className="fas fa-image text-2xl text-gray-500"></i>
                            <p className="mt-1 text-xs">{thumbName}</p>
                        </div>
                    </label>
                )}
                <input type="file" id="thumbInput" accept="image/*" className="hidden" onChange={handleThumbnailChange} />


                <button 
                    type="submit" 
                    disabled={isUploading}
                    className="w-full p-4 bg-amber-500 text-black font-bold rounded-lg text-lg disabled:bg-gray-500"
                >
                    {isUploading ? 'Publishing...' : 'PUBLISH'}
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">Note: Uploaded content is available only for the current session.</p>
            </form>
        </div>
    );
};

export default UploadSection;