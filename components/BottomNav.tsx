
import React from 'react';
import { Section } from '../types';
import { HomeIcon, GranthIcon, JaapIcon, UploadIcon, DarshanIcon, MusicPlaylistIcon } from './icons';

interface BottomNavProps {
    activeSection: Section;
    setActiveSection: (section: Section) => void;
}

const NavItem: React.FC<{
    section: Section;
    label: string;
    icon: React.ReactNode;
    activeSection: Section;
    onClick: (section: Section) => void;
}> = ({ section, label, icon, activeSection, onClick }) => {
    const isActive = activeSection === section;
    return (
        <div 
            className={`flex flex-col items-center justify-center text-center w-full transition-all duration-300 ease-in-out cursor-pointer ${isActive ? 'text-amber-400 -translate-y-1' : 'text-gray-500 hover:text-amber-500'}`}
            onClick={() => onClick(section)}
        >
            <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                {icon}
            </div>
            <span className="text-xs mt-1">{label}</span>
        </div>
    );
};


const BottomNav: React.FC<BottomNavProps> = ({ activeSection, setActiveSection }) => {
    const navItems: { section: Section; label: string; icon: React.ReactNode }[] = [
        { section: 'home', label: 'Home', icon: <HomeIcon className="h-6 w-6" /> },
        { section: 'granth', label: 'Granth', icon: <GranthIcon className="h-6 w-6" /> },
        { section: 'darshan', label: 'Darshan', icon: <DarshanIcon className="h-6 w-6" /> },
        { section: 'music', label: 'Music', icon: <MusicPlaylistIcon className="h-6 w-6" /> },
        { section: 'jaap', label: 'Jaap', icon: <JaapIcon className="h-7 w-7" /> },
        { section: 'upload', label: 'Upload', icon: <UploadIcon className="h-6 w-6" /> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[rgba(10,5,0,0.8)] backdrop-blur-lg border-t-2 border-amber-600 flex justify-around items-center z-50 shadow-lg">
            {navItems.map(item => (
                <NavItem 
                    key={item.section} 
                    {...item} 
                    activeSection={activeSection} 
                    onClick={setActiveSection} 
                />
            ))}
        </nav>
    );
};

export default BottomNav;
