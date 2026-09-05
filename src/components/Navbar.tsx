import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Sun, Moon, User as UserIcon, Rss, Sparkles} from 'lucide-react';
import {UserDropdown} from './UserDropdown';

interface NavbarProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    currentUser: string;
    onUserChange: (user: string) => void;
    onOpenAiModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
                                                  theme,
                                                  toggleTheme,
                                                  currentUser,
                                                  onUserChange,
                                                  onOpenAiModal,
                                              }) => {
    const location = useLocation();

    return (
        <header className="navbar-header">
            <div className="navbar-container">
                <Link to="/" className="brand-logo">
                    <span className="logo-accent">Bailanysta</span>
                </Link>

                <nav className="nav-links">
                    <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                        <Rss size={18}/>
                        <span>Лента</span>
                    </Link>
                    <Link
                        to={`/profile/${currentUser}`}
                        className={`nav-item ${location.pathname.startsWith('/profile') ? 'active' : ''}`}
                    >
                        <UserIcon size={18}/>
                        <span>Профиль</span>
                    </Link>
                </nav>

                <div className="navbar-actions">
                    {/* Красивый кастомный выпадающий список */}
                    <UserDropdown currentUser={currentUser} onUserChange={onUserChange}/>

                    <button className="ai-btn" onClick={onOpenAiModal} title="Сгенерировать пост с ИИ">
                        <Sparkles size={16}/>
                        <span className="hide-mobile">AI Помощник</span>
                    </button>

                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Сменить тему">
                        {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
                    </button>
                </div>
            </div>
        </header>
    );
};