import React from 'react';
import {AlertTriangle, X} from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
    loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                              isOpen,
                                                              title = 'Удаление записи',
                                                              message,
                                                              confirmText = 'Удалить',
                                                              cancelText = 'Отмена',
                                                              onConfirm,
                                                              onClose,
                                                              loading = false,
                                                          }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card confirm-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">
                        <AlertTriangle size={20} className="danger-icon"/>
                        <h3>{title}</h3>
                    </div>
                    <button className="close-btn" onClick={onClose} aria-label="Закрыть">
                        <X size={18}/>
                    </button>
                </div>

                <p className="confirm-modal-message">{message}</p>

                <div className="confirm-modal-actions">
                    <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className="btn-danger"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Удаление...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};