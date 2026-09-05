import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Post} from '../types';
import {api} from '../api';
import {ConfirmModal} from './ConfirmModal';
import {Heart, MessageSquare, User, UserPlus, UserCheck, Send, Trash2} from 'lucide-react';

interface PostCardProps {
    post: Post;
    currentUser: string;
    onPostUpdated: (post: Post) => void;
    onPostDeleted?: (postId: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
                                                      post,
                                                      currentUser,
                                                      onPostUpdated,
                                                      onPostDeleted,
                                                  }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // Состояния для кастомного диалога удаления
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribing, setSubscribing] = useState(false);

    const isOwnPost = post.author === currentUser;

    useEffect(() => {
        if (!isOwnPost) {
            api.getSubscriptionStatus(currentUser, post.author)
                .then((res) => setIsSubscribed(res.subscribed))
                .catch((e) => console.error(e));
        }
    }, [post.author, currentUser, isOwnPost]);

    const handleLike = async () => {
        try {
            const updated = await api.likePost(post.id);
            onPostUpdated(updated);
        } catch (e) {
            console.error(e);
        }
    };

    const handleToggleSubscribe = async () => {
        if (subscribing) return;
        setSubscribing(true);
        try {
            const res = await api.toggleSubscription(currentUser, post.author);
            setIsSubscribed(res.subscribed);
        } catch (e) {
            console.error(e);
        } finally {
            setSubscribing(false);
        }
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await api.deletePost(post.id, currentUser);
            setIsDeleteModalOpen(false);
            if (onPostDeleted) {
                onPostDeleted(post.id);
            }
        } catch (e) {
            console.error(e);
            alert('Не удалось удалить пост');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || isSubmittingComment) return;

        setIsSubmittingComment(true);
        try {
            const updated = await api.addComment(post.id, currentUser, commentText.trim());
            onPostUpdated(updated);
            setCommentText('');
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return (
        <>
            <article className="card post-card">
                <div className="post-header">
                    <div className="post-author-info">
                        <Link to={`/profile/${post.author}`} className="author-avatar">
                            <User size={20}/>
                        </Link>
                        <div className="author-details">
                            <Link to={`/profile/${post.author}`} className="author-name">
                                {post.author}
                            </Link>
                            <span className="post-date">
                {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                    : 'Только что'}
              </span>
                        </div>
                    </div>

                    <div className="post-header-actions">
                        {!isOwnPost && (
                            <button
                                className={`btn-inline-subscribe ${isSubscribed ? 'subscribed' : ''}`}
                                onClick={handleToggleSubscribe}
                                disabled={subscribing}
                            >
                                {isSubscribed ? (
                                    <>
                                        <UserCheck size={14}/>
                                        <span>Вы подписаны</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={14}/>
                                        <span>Подписаться</span>
                                    </>
                                )}
                            </button>
                        )}

                        {isOwnPost && (
                            <button
                                className="delete-post-btn"
                                onClick={() => setIsDeleteModalOpen(true)}
                                title="Удалить запись"
                            >
                                <Trash2 size={16}/>
                            </button>
                        )}
                    </div>
                </div>

                <p className="post-content">{post.content}</p>

                <div className="post-footer">
                    <button className="action-btn like-btn" onClick={handleLike}>
                        <Heart size={18} className={post.likesCount > 0 ? 'liked' : ''}/>
                        <span>{post.likesCount || 0}</span>
                    </button>

                    <button className="action-btn comment-btn" onClick={() => setShowComments(!showComments)}>
                        <MessageSquare size={18}/>
                        <span>{post.comments?.length || 0}</span>
                    </button>
                </div>

                {showComments && (
                    <div className="comments-section">
                        <form onSubmit={handleAddComment} className="comment-form">
                            <input
                                type="text"
                                placeholder="Написать комментарий..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button type="submit" disabled={!commentText.trim() || isSubmittingComment}>
                                <Send size={14}/>
                            </button>
                        </form>

                        <div className="comments-list">
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map((comment, index) => (
                                    <div key={comment.id || index} className="comment-item">
                                        <div className="comment-header-info">
                                            <span className="comment-author">{comment.author}</span>
                                            <span className="comment-date">
                        {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                            : 'Только что'}
                      </span>
                                        </div>
                                        <p className="comment-text">{comment.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="no-comments">Пока нет комментариев. Будьте первым!</p>
                            )}
                        </div>
                    </div>
                )}
            </article>

            {/* Модальное окно подтверждения */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Удаление записи"
                message="Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить."
                confirmText="Удалить"
                cancelText="Отмена"
                loading={isDeleting}
                onConfirm={handleConfirmDelete}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </>
    );
};