import React, {useState, useRef, useEffect} from 'react';
import {User, ChevronDown, Check} from 'lucide-react';

interface UserDropdownProps {
    currentUser: string;
    onUserChange: (user: string) => void;
}

const USERS = ['Zhastilek', 'Arman', 'Aruzhan', 'Nariman'];

export const UserDropdown: React.FC<UserDropdownProps> = ({currentUser, onUserChange}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Закрытие при клике вне меню
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (user: string) => {
        onUserChange(user);
        setIsOpen(false);
    };

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            <button
                type="button"
                className="dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className="dropdown-user-info">
                    <User size={16} className="dropdown-icon"/>
                    <span className="dropdown-username">{currentUser}</span>
                </div>
                <ChevronDown size={14} className={`dropdown-arrow ${isOpen ? 'open' : ''}`}/>
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-header">Сменить пользователя</div>
                    {USERS.map((user) => {
                        const isSelected = user === currentUser;
                        return (
                            <button
                                key={user}
                                type="button"
                                className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleSelect(user)}
                            >
                                <div className="dropdown-item-left">
                                    <User size={15}/>
                                    <span>{user}</span>
                                </div>
                                {isSelected && <Check size={14} className="check-icon"/>}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};