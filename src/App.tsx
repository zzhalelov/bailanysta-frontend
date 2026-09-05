import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import {Navbar} from './components/Navbar';
import {FeedPage} from './pages/FeedPage';
import {ProfilePage} from './pages/ProfilePage';
import {AiGenerator} from './components/AiGenerator';

export const AppContent: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    });

    // Храним текущего активного пользователя
    const [currentUser, setCurrentUser] = useState<string>(() => {
        return localStorage.getItem('currentUser') || 'Zhallelov';
    });

    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiDraft, setAiDraft] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleUserChange = (newUser: string) => {
        setCurrentUser(newUser);
        localStorage.setItem('currentUser', newUser);

        if (location.pathname.startsWith('/profile')) {
            navigate(`/profile/${newUser}`);
        }
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const handleApplyAiText = (text: string) => {
        setAiDraft(text);
        navigate(`/profile/${currentUser}`);
    };

    return (
        <div className="app-layout">
            <Navbar
                theme={theme}
                toggleTheme={toggleTheme}
                currentUser={currentUser}
                onUserChange={handleUserChange}
                onOpenAiModal={() => setIsAiModalOpen(true)}
            />

            <Routes>
                <Route path="/" element={<FeedPage currentUser={currentUser}/>}/>
                <Route
                    path="/profile/:username"
                    element={
                        <ProfilePage
                            currentUser={currentUser}
                            externalDraftContent={aiDraft}
                            clearDraftContent={() => setAiDraft('')}
                        />
                    }
                />
            </Routes>

            <AiGenerator
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                onApplyGeneratedText={handleApplyAiText}
            />
        </div>
    );
};

export const App: React.FC = () => (
    <Router>
        <AppContent/>
    </Router>
);

export default App;