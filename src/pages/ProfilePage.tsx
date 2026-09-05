import React, {useEffect, useState, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {Post} from '../types';
import {api} from '../api';
import {PostCard} from '../components/PostCard';
import {SkeletonPost} from '../components/Skeleton';
import {User, Send, UserPlus, UserCheck} from 'lucide-react';

interface ProfilePageProps {
    currentUser: string;
    externalDraftContent?: string;
    clearDraftContent?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
                                                            currentUser,
                                                            externalDraftContent,
                                                            clearDraftContent,
                                                        }) => {
    const {username} = useParams<{ username: string }>();
    const profileUser = username || currentUser;

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPostText, setNewPostText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Состояние подписки
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribing, setSubscribing] = useState(false);

    const isOwnProfile = profileUser === currentUser;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Заполнение черновика, сгенерированного ИИ
    useEffect(() => {
        if (externalDraftContent) {
            setNewPostText(externalDraftContent);
            if (clearDraftContent) clearDraftContent();
        }
    }, [externalDraftContent, clearDraftContent]);

    // Динамическая подгонка высоты textarea под длинный текст
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newPostText]);

    const fetchUserPosts = async () => {
        setLoading(true);
        try {
            const data = await api.getUserPosts(profileUser);
            setPosts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPosts();

        if (!isOwnProfile) {
            api.getSubscriptionStatus(currentUser, profileUser)
                .then((res) => setIsSubscribed(res.subscribed))
                .catch((e) => console.error(e));
        }
    }, [profileUser, currentUser, isOwnProfile]);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const created = await api.createPost(profileUser, newPostText.trim());
            setPosts([created, ...posts]);
            setNewPostText('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleSubscribe = async () => {
        if (subscribing) return;
        setSubscribing(true);
        try {
            const res = await api.toggleSubscription(currentUser, profileUser);
            setIsSubscribed(res.subscribed);
        } catch (e) {
            console.error(e);
        } finally {
            setSubscribing(false);
        }
    };

    const handlePostUpdated = (updatedPost: Post) => {
        setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    };

    const handlePostDeleted = (deletedPostId: number) => {
        setPosts((prev) => prev.filter((p) => p.id !== deletedPostId));
    };

    return (
        <main className="container page-content">
            <div className="card profile-header-card">
                <div className="profile-header-main">
                    <div className="profile-avatar-large">
                        <User size={40}/>
                    </div>
                    <div className="profile-details">
                        <h2>{profileUser}</h2>
                        <p className="user-handle">@{profileUser.toLowerCase()}</p>
                        <span className="badge">Публикаций: {posts.length}</span>
                    </div>
                </div>

                {/* Кнопка подписки для чужого профиля */}
                {!isOwnProfile && (
                    <div className="profile-actions">
                        <button
                            className={`btn-subscribe ${isSubscribed ? 'subscribed' : ''}`}
                            onClick={handleToggleSubscribe}
                            disabled={subscribing}
                        >
                            {isSubscribed ? (
                                <>
                                    <UserCheck size={16}/>
                                    <span>Вы подписаны</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus size={16}/>
                                    <span>Подписаться</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {isOwnProfile && (
                <div className="card create-post-card">
                    <h3>Создать новую запись</h3>
                    <form onSubmit={handleCreatePost} className="create-post-form">
            <textarea
                ref={textareaRef}
                className="create-post-textarea"
                placeholder="Поделитесь своими мыслями..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                rows={3}
            />
                        <div className="create-post-actions">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={!newPostText.trim() || isSubmitting}
                            >
                                <Send size={16}/>
                                Опубликовать
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="user-posts-feed">
                <h3>Записи пользователя</h3>
                {loading ? (
                    <>
                        <SkeletonPost/>
                        <SkeletonPost/>
                    </>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            currentUser={currentUser}
                            onPostUpdated={handlePostUpdated}
                            onPostDeleted={handlePostDeleted}
                        />
                    ))
                ) : (
                    <p className="empty-feed">У этого пользователя пока нет опубликованных постов.</p>
                )}
            </div>
        </main>
    );
};