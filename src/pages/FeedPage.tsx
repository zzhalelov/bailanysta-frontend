import React, {useEffect, useState} from 'react';
import {Post} from '../types';
import {api} from '../api';
import {PostCard} from '../components/PostCard';
import {SkeletonPost} from '../components/Skeleton';
import {Search, Globe, Users} from 'lucide-react';

interface FeedPageProps {
    currentUser: string;
}

export const FeedPage: React.FC<FeedPageProps> = ({currentUser}) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'subscriptions'>('all');

    const fetchPosts = async () => {
        setLoading(true);
        try {
            if (activeTab === 'subscriptions') {
                const data = await api.getSubscriptionsFeed(currentUser);
                setPosts(data);
            } else {
                const data = await api.getPosts(searchQuery);
                setPosts(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Автоматический перезапрос при смене вкладки, пользователя или поискового запроса
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPosts();
        }, 300); // Debounce задержка 300мс для комфортного ввода текста

        return () => clearTimeout(timer);
    }, [activeTab, currentUser, searchQuery]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchPosts();
    };

    const handlePostDeleted = (deletedPostId: number) => {
        setPosts((prev) => prev.filter((p) => p.id !== deletedPostId));
    };

    const handlePostUpdated = (updatedPost: Post) => {
        setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    };

    return (
        <main className="container page-content">
            <div className="feed-header">
                <h2>Лента публикаций</h2>

                {/* Вкладки ленты */}
                <div className="feed-tabs">
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        <Globe size={16}/>
                        <span>Все посты</span>
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('subscriptions')}
                    >
                        <Users size={16}/>
                        <span>Мои подписки</span>
                    </button>
                </div>

                {activeTab === 'all' && (
                    <form onSubmit={handleSearchSubmit} className="search-box">
                        <Search size={18} className="search-icon"/>
                        <input
                            type="text"
                            placeholder="Поиск по ключевым словам или автору..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                )}
            </div>

            <div className="posts-feed">
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
                    <div className="empty-feed">
                        <p>
                            {activeTab === 'subscriptions'
                                ? 'У вас пока нет подписок или ваши авторы еще ничего не опубликовали.'
                                : 'Постов пока нет.'}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
};