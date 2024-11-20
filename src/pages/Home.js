import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Pagination,
    Box,
    Skeleton,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Favorite,
    FavoriteBorder,
    Bookmark,
    BookmarkBorder,
    Comment,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
    getFeaturedArticles,
    getLatestArticles,
    toggleArticleHeart,
    toggleArticleBookmark,
} from '../api/endpoints';
import { useNavigate } from "react-router-dom";

export const ArticleCard = ({ article, featured, mainFeatured, onArticleUpdate }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [articleState, setArticleState] = useState(article);

    const handleHeart = async (e) => {
        e.stopPropagation();
        try {
            const response = await toggleArticleHeart(article.id);
            const updatedArticle = {
                ...articleState,
                hearted: !articleState.hearted,
                heartCount: articleState.hearted
                    ? articleState.heartCount - 1
                    : articleState.heartCount + 1
            };
            setArticleState(updatedArticle);
            toast.success(updatedArticle.hearted ? 'Hearted' : 'Heart canceled');
        } catch (error) {
            toast.error(error);
        }
    };

    const handleBookmark = async (e) => {
        e.stopPropagation();
        try {
            const response = await toggleArticleBookmark(article.id);
            const updatedArticle = {
                ...articleState,
                bookmarked: !articleState.bookmarked,
                bookmarkCount: articleState.bookmarked
                    ? articleState.bookmarkCount - 1
                    : articleState.bookmarkCount + 1
            };
            setArticleState(updatedArticle);
            toast.success(updatedArticle.bookmarked ? 'Added to bookmarks' : 'Removed from bookmarks');
        } catch (error) {
            toast.error('Error updating bookmark status');
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out',
                },
            }}
            onClick={() => navigate(`/article/${articleState.id}`)}
        >
            <CardMedia
                component="img"
                height={mainFeatured ? 500 : featured ? 250 : 200}
                image={articleState.mainImageUrl || 'https://via.placeholder.com/400x200'}
                alt={articleState.title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                    gutterBottom
                    variant={mainFeatured ? 'h3' : featured ? 'h5' : 'h6'}
                    component="div"
                    sx={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                        lineHeight: mainFeatured ? '1.2em' : '1.4em',
                        minHeight: mainFeatured ? '2.4em' : '2.8em',
                    }}
                >
                    {articleState.title}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: mainFeatured ? 3 : 2,
                        overflow: 'hidden'
                    }}
                >
                    {articleState.shortDescription}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            size={mainFeatured ? "medium" : "small"}
                            startIcon={articleState.hearted ? <Favorite /> : <FavoriteBorder />}
                            onClick={handleHeart}
                        >
                            {articleState.heartCount}
                        </Button>
                        <Button
                            size={mainFeatured ? "medium" : "small"}
                            startIcon={<Comment />}
                        >
                            {articleState.commentCount}
                        </Button>
                    </Box>
                    <Button
                        size={mainFeatured ? "medium" : "small"}
                        startIcon={articleState.bookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
                        onClick={handleBookmark}
                    >
                        {articleState.bookmarkCount}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

const Home = () => {
    const [featuredArticles, setFeaturedArticles] = useState([]);
    const [latestArticles, setLatestArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [featuredLoading, setFeaturedLoading] = useState(true);
    const [latestLoading, setLatestLoading] = useState(true);
    const latestArticlesRef = useRef(null);
    const prevNextArticlesCache = useRef({});
    const totalPagesRef = useRef(1);

    const fetchFeaturedArticles = async () => {
        setFeaturedLoading(true);
        try {
            const data = await getFeaturedArticles();
            setFeaturedArticles(data.slice(0, 5));
        } catch (error) {
            toast.error('Error fetching featured articles');
        } finally {
            setFeaturedLoading(false);
        }
    };

    const prefetchArticles = async (pageNum) => {
        if (!prevNextArticlesCache.current[pageNum]) {
            try {
                const data = await getLatestArticles(pageNum, 9);
                prevNextArticlesCache.current[pageNum] = data.articles;
                totalPagesRef.current = data.totalPages;
            } catch (error) {
                console.error('Error prefetching articles:', error);
            }
        }
    };

    const fetchLatestArticles = async (currentPage) => {
        setLatestLoading(true);
        try {
            // If we have cached data, use it and don't fetch again
            if (prevNextArticlesCache.current[currentPage]) {
                setLatestArticles(prevNextArticlesCache.current[currentPage]);
                setTotalPages(totalPagesRef.current);
                setLatestLoading(false);

                // Prefetch adjacent pages if needed
                setTimeout(() => {
                    const prefetchTasks = [];
                    if (currentPage > 1 && !prevNextArticlesCache.current[currentPage - 1]) {
                        prefetchTasks.push(prefetchArticles(currentPage - 1));
                    }
                    if (currentPage < totalPagesRef.current && !prevNextArticlesCache.current[currentPage + 1]) {
                        prefetchTasks.push(prefetchArticles(currentPage + 1));
                    }
                    Promise.all(prefetchTasks);
                }, 0);

                return; // Exit early if we have cached data
            }

            // If no cached data, fetch from server
            const data = await getLatestArticles(currentPage, 9);
            setLatestArticles(data.articles);
            setTotalPages(data.totalPages);
            totalPagesRef.current = data.totalPages;
            prevNextArticlesCache.current[currentPage] = data.articles;

            // Prefetch adjacent pages
            setTimeout(() => {
                const prefetchTasks = [];
                if (currentPage > 1 && !prevNextArticlesCache.current[currentPage - 1]) {
                    prefetchTasks.push(prefetchArticles(currentPage - 1));
                }
                if (currentPage < data.totalPages && !prevNextArticlesCache.current[currentPage + 1]) {
                    prefetchTasks.push(prefetchArticles(currentPage + 1));
                }
                Promise.all(prefetchTasks);
            }, 0);

        } catch (error) {
            toast.error('Error fetching latest articles');
        } finally {
            setLatestLoading(false);
        }
    };

    useEffect(() => {
        fetchFeaturedArticles();
        fetchLatestArticles(page);
    }, []);

    useEffect(() => {
        if (featuredArticles.length > 0) { // Only fetch latest articles if featured are loaded
            fetchLatestArticles(page);
        }
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
        latestArticlesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Featured Articles
            </Typography>
            {featuredLoading ? (
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid item xs={12}>
                        <Skeleton variant="rectangular" height={600} />
                    </Grid>
                    <Grid container item spacing={2}>
                        {[...Array(4)].map((_, index) => (
                            <Grid item key={index} xs={12} sm={6}>
                                <Skeleton variant="rectangular" height={300} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            ) : (
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {featuredArticles.length > 0 && (
                        <Grid item xs={12}>
                            <ArticleCard article={featuredArticles[0]} featured mainFeatured />
                        </Grid>
                    )}
                    <Grid container item spacing={2}>
                        {featuredArticles.slice(1, 5).map((article) => (
                            <Grid item key={article.id} xs={12} sm={6}>
                                <ArticleCard article={article} featured />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            )}

            <div ref={latestArticlesRef}>
                <Typography variant="h4" gutterBottom>
                    Latest Articles
                </Typography>
            </div>

            {latestLoading ? (
                <Grid container spacing={4} sx={{ mb: 4 }}>
                    {[...Array(9)].map((_, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Skeleton variant="rectangular" height={300} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container spacing={4} sx={{ mb: 4 }}>
                    {latestArticles.map((article) => (
                        <Grid item key={article.id} xs={12} sm={6} md={4}>
                            <ArticleCard article={article} />
                        </Grid>
                    ))}
                </Grid>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                />
            </Box>
        </Container>
    );
};

export default Home;