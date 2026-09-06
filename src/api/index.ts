import {Post, Comment} from '../types';

// Использование относительного пути '/api' по умолчанию для работы через Nginx на VPS
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
console.log('Текущий API_BASE_URL:', API_BASE_URL);

export const api = {
    // Получить все посты или выполнить поиск
    async getPosts(searchQuery?: string): Promise<Post[]> {
        const url = searchQuery
            ? `${API_BASE_URL}/posts?search=${encodeURIComponent(searchQuery)}`
            : `${API_BASE_URL}/posts`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Ошибка загрузки постов');
        return res.json();
    },

    // Посты конкретного пользователя
    async getUserPosts(author: string): Promise<Post[]> {
        const res = await fetch(`${API_BASE_URL}/posts/user/${encodeURIComponent(author)}`);
        if (!res.ok) throw new Error('Ошибка загрузки постов пользователя');
        return res.json();
    },

    // Создать новый пост
    async createPost(author: string, content: string): Promise<Post> {
        const res = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({author, content, likesCount: 0}),
        });
        if (!res.ok) throw new Error('Ошибка при создании поста');
        return res.json();
    },

    // Поставить лайк
    async likePost(id: number): Promise<Post> {
        const res = await fetch(`${API_BASE_URL}/posts/${id}/like`, {
            method: 'POST',
        });
        if (!res.ok) throw new Error('Ошибка при установке лайка');
        return res.json();
    },

    // Добавить комментарий
    async addComment(postId: number, author: string, text: string): Promise<Post> {
        const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({author, text}),
        });
        if (!res.ok) throw new Error('Ошибка добавления комментария');
        return res.json();
    },

    // Сгенерировать пост с помощью Gemini через бэкенд
    async generateAiContent(topic: string): Promise<string> {
        const res = await fetch(`${API_BASE_URL}/posts/ai-generate`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({topic}),
        });
        if (!res.ok) throw new Error('Ошибка AI генерации');
        const data = await res.json();
        return data.text;
    },

    // Получить ленту подписок
    async getSubscriptionsFeed(follower: string): Promise<Post[]> {
        const res = await fetch(`${API_BASE_URL}/posts/feed/subscriptions?follower=${encodeURIComponent(follower)}`);
        if (!res.ok) throw new Error('Ошибка загрузки ленты подписок');
        return res.json();
    },

    // Переключить статус подписки
    async toggleSubscription(follower: string, following: string): Promise<{ subscribed: boolean }> {
        const res = await fetch(`${API_BASE_URL}/posts/subscriptions/toggle`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({follower, following}),
        });
        if (!res.ok) throw new Error('Ошибка переключения подписки');
        return res.json();
    },

    // Статус подписки
    async getSubscriptionStatus(follower: string, following: string): Promise<{ subscribed: boolean }> {
        const res = await fetch(
            `${API_BASE_URL}/posts/subscriptions/status?follower=${encodeURIComponent(follower)}&following=${encodeURIComponent(following)}`
        );
        if (!res.ok) throw new Error('Ошибка получения статуса подписки');
        return res.json();
    },

    // Удалить пост
    async deletePost(id: number, author: string): Promise<void> {
        const res = await fetch(
            `${API_BASE_URL}/posts/${id}?author=${encodeURIComponent(author)}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!res.ok) {
            throw new Error(`Ошибка при удалении поста: ${res.statusText}`);
        }
    },
};