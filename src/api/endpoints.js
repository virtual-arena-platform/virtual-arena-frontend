import axios from 'axios';

const API_BASE_URL = 'https://virtual-arena-backend.onrender.com';


const isAuthenticated = () => {
    return !!localStorage.getItem('accessToken');
};

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Authentication endpoints
export const register = async (username, email, password) => {
    const response = await api.post('/api/v1/auth/register', {
        username,
        email,
        password,
    });

    return response.data;
};

export const login = async (providedUsername, providedPassword) => {
    const response = await api.post('/api/v1/auth/authenticate', {
        username: providedUsername,
        password: providedPassword,
    });
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    if (!isAuthenticated()) {
        window.location.href = '/auth/sign-in';
    }
    const res = await api.get('/api/v1/auth/me');
    const { id, email, username, avatarUrl, verified, createdAt } = res.data;

    localStorage.setItem('id', id);
    localStorage.setItem('email', email);
    localStorage.setItem('username', username);
    localStorage.setItem('avatarUrl', avatarUrl);
    localStorage.setItem('verified', verified);
    localStorage.setItem('createdAt', createdAt)

    return response.data;
};


export const changePassword = async (oldPassword, newPassword) => {
    const response = await api.post('/api/v1/auth/change-password', {
        oldPassword,
        newPassword,
    });
    return response.data;
};

export const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/api/v1/auth/refresh-token', {
        refreshToken,
    });
    const { accessToken, newRefreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    return response.data;
};

export const sendEmailVerification = async (email) => {
    const response = await api.post('/api/v1/auth/verify-email/send', { email });
    return response.data;
};

export const verifyEmail = async (email, code) => {
    const response = await api.post('/api/v1/auth/verify-email/verify', {
        email,
        code,
    });
    return response.data;
};



export const updateMe = async (username, avatarUrl) => {
    const response = await api.post('/api/v1/auth/me/update', {username, avatarUrl});
    return response.data;
};



// Articles endpoints
export const getFeaturedArticles = async () => {
    const response = await api.get('/article/featured');
    return response.data;
};

export const getMyArticles = async (page = 1, limit = 9) => {
    const response = await api.get('/article/me', {
        params: { page, limit }
    });
    return response.data;
}

export const getBookmarkedArticles = async (page = 1, limit = 9) => {
    const response = await api.get('/article/bookmarked', {
        params: { page, limit }
    });
    return response.data;
}


export const updateArticle = async (articleId, articleData) => {
    const response = await api.put(`/article/${articleId}`, articleData)
    return response.data;
}


export const getLatestArticles = async (page = 1, limit = 9) => {
    const response = await api.get('/article/latest', {
        params: { page, limit },
    });
    return response.data;
};

export const searchArticles = async (query, page = 1, limit = 9) => {
    const response = await api.get('/article/search', {
        params: { query, page, limit },
    });
    return response.data;
};

export const getArticleDetails = async (articleId) => {
    const response = await api.get(`/article/${articleId}`);
    return response.data;
};

export const createArticle = async (articleData) => {
    const response = await api.post('/article', articleData);
    return response.data;
};

export const deleteArticle = async (articleId) => {
    const response = await api.delete(`/article/${articleId}`);
    // Navigate back to the articles list or home page
    window.history.back();
    return response.data;
};

export const toggleArticleHeart = async (articleId) => {
    if (!isAuthenticated()) {
        window.location.href = '/auth/sign-in';
    }
    const response = await api.post(`/article/${articleId}/heart`);



    return response.data;
};


export const toggleArticleBookmark = async (articleId) => {
    if (!isAuthenticated()) {
        window.location.href = '/auth/sign-in';
    }
    const response = await api.post(`/article/${articleId}/bookmark`);
    return response.data;
};

// Comments endpoints
export const getArticleComments = async (articleId, page = 1, limit = 10) => {
    const response = await api.get(`/article/${articleId}/comments`, {
        params: { page, limit },
    });
    return response.data;
};

export const createComment = async (articleId, content) => {
    const response = await api.post(`/article/${articleId}/comments`, { content });
    return response.data;
};

export const deleteComment = async (commentId) => {
    const response = await api.delete(`/comment/${commentId}`);
    return response.data;
};

// Replies endpoints
export const getCommentReplies = async (commentId, page = 1, limit = 10) => {
    const response = await api.get(`/comment/${commentId}/replies`, {
        params: { page, limit },
    });
    return response.data;
};

export const deleteReply = async (replyId) => {
    const response = await api.delete(`/${replyId}/reply`);
    return response.data;
};

export const createReply = async (commentId, content) => {
    const response = await api.post(`/comment/${commentId}/replies`, { content });
    return response.data;
};





// Utility functions
export const logout = () => {
    localStorage.clear();
    window.location.href = '/auth/sign-in';
};

export default api;