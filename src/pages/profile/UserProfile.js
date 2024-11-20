import React, {useState, useEffect, useRef} from 'react';
import {
    Box,
    Container,
    Paper,
    Avatar,
    Typography,
    Button,
    TextField,
    Grid,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Pagination, Tabs, Tab
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import {changePassword, logout, updateMe, getMyArticles, getBookmarkedArticles} from '../../api/endpoints';
import { ArticleCard } from '../Home';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        avatarUrl: '',
    });
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [articles, setArticles] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const prevNextArticlesCache = useRef({});
    const totalPagesRef = useRef(1);

    const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
    const [bookmarkedTotalPages, setBookmarkedTotalPages] = useState(0);
    const [bookmarkedCurrentPage, setBookmarkedCurrentPage] = useState(1);
    const bookmarkedArticlesCache = useRef({});
    const bookmarkedTotalPagesRef = useRef(1);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        fetchUserDetails();
        fetchUserArticles(1);
        fetchBookmarkedArticles(1);
    }, []);

    const fetchBookmarkedArticles = async (page) => {
        try {
            if (bookmarkedArticlesCache.current[page]) {
                setBookmarkedArticles(bookmarkedArticlesCache.current[page]);
                setBookmarkedTotalPages(bookmarkedTotalPagesRef.current);
                return;
            }

            const response = await getBookmarkedArticles(page);
            setBookmarkedArticles(response.articles);
            setBookmarkedTotalPages(response.totalPages);
            bookmarkedTotalPagesRef.current = response.totalPages;
            bookmarkedArticlesCache.current[page] = response.articles;

        } catch (error) {
            toast.error('Failed to fetch bookmarked articles');
            console.error('Error fetching bookmarked articles:', error);
        }
    };

    const handleBookmarkedPageChange = (event, value) => {
        setBookmarkedCurrentPage(value);
        fetchBookmarkedArticles(value);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const fetchUserDetails = async () => {
        try {
            const userData = {
                id: localStorage.getItem('id'),
                email: localStorage.getItem('email'),
                username: localStorage.getItem('username'),
                avatarUrl: localStorage.getItem('avatarUrl'),
                verified: localStorage.getItem('verified'),
                createdAt: localStorage.getItem('createdAt')
            };
            setUser(userData);
            setFormData({
                username: userData.username,
                avatarUrl: userData.avatarUrl || '',
            });
        } catch (error) {
            toast.error('Failed to fetch user details');
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserArticles = async (page) => {
        try {
            // If we have cached data, use it
            if (prevNextArticlesCache.current[page]) {
                setArticles(prevNextArticlesCache.current[page]);
                setTotalPages(totalPagesRef.current);

                // Prefetch adjacent pages if needed
                setTimeout(() => {
                    const prefetchTasks = [];
                    if (page > 1 && !prevNextArticlesCache.current[page - 1]) {
                        prefetchTasks.push(prefetchArticles(page - 1));
                    }
                    if (page < totalPagesRef.current && !prevNextArticlesCache.current[page + 1]) {
                        prefetchTasks.push(prefetchArticles(page + 1));
                    }
                    Promise.all(prefetchTasks);
                }, 0);

                return;
            }

            // If no cached data, fetch from server
            const response = await getMyArticles(page);
            setArticles(response.articles);
            setTotalPages(response.totalPages);
            totalPagesRef.current = response.totalPages;
            prevNextArticlesCache.current[page] = response.articles;

            // Prefetch adjacent pages
            setTimeout(() => {
                const prefetchTasks = [];
                if (page > 1 && !prevNextArticlesCache.current[page - 1]) {
                    prefetchTasks.push(prefetchArticles(page - 1));
                }
                if (page < response.totalPages && !prevNextArticlesCache.current[page + 1]) {
                    prefetchTasks.push(prefetchArticles(page + 1));
                }
                Promise.all(prefetchTasks);
            }, 0);

        } catch (error) {
            toast.error('Failed to fetch articles');
            console.error('Error fetching articles:', error);
        }
    };
    const handleUpdateProfile = async () => {
        try {
            const updatedUser = await updateMe(formData.username, formData.avatarUrl);
            setUser(updatedUser);
            setEditMode(false);
            toast.success('Profile updated successfully');
            logout();
        } catch (error) {
            toast.error('Failed to update profile');
            console.error('Error updating profile:', error);
        }
    };

    const handlePasswordChange = async () => {
        try {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                toast.error("Passwords don't match");
                return;
            }

            await changePassword(passwordData.currentPassword, passwordData.newPassword);

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            setOpenPasswordDialog(false);
            toast.success('Password changed successfully');
            logout();
        } catch (error) {
            toast.error('Failed to change password');
            console.error('Error changing password:', error);
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        fetchUserArticles(value);
    };


    // When an article is updated, update the cache as well
    const handleArticleUpdate = (updatedArticle) => {
        const updatedArticles = articles.map(a =>
            a.id === updatedArticle.id ? updatedArticle : a
        );
        setArticles(updatedArticles);

        // Update the article in cache if it exists
        Object.keys(prevNextArticlesCache.current).forEach(pageNum => {
            const cachedArticles = prevNextArticlesCache.current[pageNum];
            const articleIndex = cachedArticles.findIndex(a => a.id === updatedArticle.id);
            if (articleIndex !== -1) {
                const newCachedArticles = [...cachedArticles];
                newCachedArticles[articleIndex] = updatedArticle;
                prevNextArticlesCache.current[pageNum] = newCachedArticles;
            }
        });
    };

    const prefetchArticles = async (pageNum) => {
        if (!prevNextArticlesCache.current[pageNum]) {
            try {
                const response = await getMyArticles(pageNum);
                prevNextArticlesCache.current[pageNum] = response.articles;
                totalPagesRef.current = response.totalPages;
            } catch (error) {
                console.error('Error prefetching articles:', error);
            }
        }
    };



    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <Container maxWidth="md">
                <Typography variant="h6" color="error" align="center">
                    Failed to load user profile
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar
                        src={user.avatarUrl}
                        sx={{ width: 100, height: 100, mr: 3 }}
                    />
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            {user.username}
                        </Typography>
                        <Typography color="textSecondary" gutterBottom>
                            {user.email}
                            {user.verified &&
                                <Typography component="span" color="success.main" sx={{ ml: 1 }}>
                                    (Verified)
                                </Typography>
                            }
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Member since: {new Date(user.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {editMode ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    username: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Avatar URL"
                                value={formData.avatarUrl}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    avatarUrl: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleUpdateProfile}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => setEditMode(true)}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setOpenPasswordDialog(true)}
                        >
                            Change Password
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Articles Section */}
            <Paper sx={{ p: 4, my: 4 }}>
                <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                    <Tab label="My Articles" />
                    <Tab label="Bookmarked Articles" />
                </Tabs>

                <Divider sx={{ mb: 3 }} />

                {activeTab === 0 ? (
                    <>
                        <Grid container spacing={3}>
                            {articles.map((article) => (
                                <Grid item xs={12} sm={6} md={4} key={article.id}>
                                    <ArticleCard
                                        article={article}
                                        onArticleUpdate={handleArticleUpdate}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {bookmarkedArticles.map((article) => (
                                <Grid item xs={12} sm={6} md={4} key={article.id}>
                                    <ArticleCard
                                        article={article}
                                        onArticleUpdate={handleArticleUpdate}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {bookmarkedTotalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={bookmarkedTotalPages}
                                    page={bookmarkedCurrentPage}
                                    onChange={handleBookmarkedPageChange}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </>
                )}
            </Paper>

            {/* Password Change Dialog */}
            <Dialog
                open={openPasswordDialog}
                onClose={() => setOpenPasswordDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Current Password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    currentPassword: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="password"
                                label="New Password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    newPassword: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Confirm New Password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    confirmPassword: e.target.value
                                })}
                                error={passwordData.newPassword !== passwordData.confirmPassword}
                                helperText={
                                    passwordData.newPassword !== passwordData.confirmPassword
                                        ? "Passwords don't match"
                                        : ""
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPasswordDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handlePasswordChange}
                        disabled={!passwordData.currentPassword ||
                            !passwordData.newPassword ||
                            !passwordData.confirmPassword ||
                            passwordData.newPassword !== passwordData.confirmPassword}
                    >
                        Change Password
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserProfile;