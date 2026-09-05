import React, {useState} from 'react';
import {api} from '../api';
import {Sparkles, X, Loader2} from 'lucide-react';

interface AiGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyGeneratedText: (text: string) => void;
}

export const AiGenerator: React.FC<AiGeneratorProps> = ({isOpen, onClose, onApplyGeneratedText}) => {
    const [topic, setTopic] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        try {
            const text = await api.generateAiContent(topic.trim());
            setGeneratedText(text);
        } catch (e) {
            setGeneratedText('Не удалось сгенерировать текст. Проверьте подключение к бэкенду.');
        } finally {
            setLoading(false);
        }
    };

    const handleUseText = () => {
        onApplyGeneratedText(generatedText);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">
                        <Sparkles size={22} className="ai-icon"/>
                        <h3>AI Генератор постов (Gemini)</h3>
                    </div>
                    <button className="close-btn" onClick={onClose} aria-label="Закрыть">
                        <X size={20}/>
                    </button>
                </div>

                <form onSubmit={handleGenerate} className="modal-body">
                    <label className="form-label">О чем вы хотите написать пост?</label>
                    <textarea
                        className="form-input form-textarea"
                        placeholder="Например: Впечатления от изучения Spring Boot..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        rows={3}
                    />
                    <button type="submit" className="btn-primary flex-center" disabled={loading || !topic.trim()}>
                        {loading ? <Loader2 className="spinner" size={18}/> : 'Сгенерировать'}
                    </button>
                </form>

                {generatedText && (
                    <div className="ai-result-box">
                        <h4>Результат:</h4>
                        <p>{generatedText}</p>
                        <div className="ai-result-actions">
                            <button className="btn-secondary" onClick={handleUseText}>
                                Вставить в пост
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};