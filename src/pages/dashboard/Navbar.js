// components/Navbar.jsx
import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box,
    useMediaQuery,
    useTheme,
    Avatar,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Badge,
    InputBase,
    Paper,
    Card,
    CardContent,
    CardMedia,
    ClickAwayListener,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home,
    Search as SearchIcon,
    Add as AddIcon,
    Notifications,
    Person,
    Logout,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logout, searchArticles } from '../../api/endpoints';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const isAuthenticated = localStorage.getItem('accessToken');

    const handleSearch = debounce(async (query) => {
        if (query.trim()) {
            try {
                const response = await searchArticles(query);
                setSearchResults(response.articles);
                setShowSearchResults(true);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    }, 300);

    const handleSearchItemClick = (articleId) => {
        navigate(`/article/${articleId}`);
        setShowSearchResults(false);
        setSearchOpen(false);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationMenu = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/auth/sign-in');
        handleClose();
    };

    const drawer = (
        <Box sx={{ width: 250 }}>
            <List>
                <ListItem button onClick={() => {
                    navigate('/');
                    handleDrawerToggle();
                }}>
                    <ListItemIcon><Home /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={() => {
                    navigate('/article/create');
                    handleDrawerToggle();
                }}>
                    <ListItemIcon><AddIcon /></ListItemIcon>
                    <ListItemText primary="Create Article" />
                </ListItem>
            </List>
        </Box>
    );

    const searchResultsList = (
        <Box
            sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                maxHeight: '400px',
                overflowY: 'auto',
                bgcolor: 'background.paper',
                boxShadow: 3,
                zIndex: 1202,
            }}
        >
            {searchResults.map((article) => (
                <Card
                    key={article.id}
                    sx={{
                        display: 'flex',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => handleSearchItemClick(article.id)}
                >
                    <CardMedia
                        component="img"
                        sx={{ width: 100, height: 100, objectFit: 'cover' }}
                        image={article.mainImageUrl || '/placeholder-image.jpg'}
                        alt={article.title}
                    />
                    <CardContent sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" component="div">
                            {article.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {article.shortDescription}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            by {article.publisher.username} • {article.timeAgo}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );

    const searchBar = (
        <ClickAwayListener onClickAway={() => {
            setShowSearchResults(false);
            if (isMobile) {
                setSearchOpen(false);
            }
        }}>
            <Box sx={{
                position: 'relative',
                width: isMobile ? '100%' : 400,
            }}>
                <Paper
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        position: isMobile && searchOpen ? 'fixed' : 'relative',
                        top: isMobile && searchOpen ? '0' : 'auto',
                        left: isMobile && searchOpen ? '0' : 'auto',
                        right: isMobile && searchOpen ? '0' : 'auto',
                        zIndex: 1201,
                        m: isMobile && searchOpen ? 0 : 0,
                    }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search articles..."
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <IconButton onClick={() => {
                        setSearchOpen(false);
                        setShowSearchResults(false);
                    }}>
                        {searchOpen ? <CloseIcon /> : <SearchIcon />}
                    </IconButton>
                </Paper>
                {showSearchResults && searchResults.length > 0 && (
                    <Box
                        sx={{
                            position: isMobile ? 'fixed' : 'absolute',
                            top: isMobile ? '48px' : '100%',
                            left: 0,
                            right: 0,
                            maxHeight: '60vh',
                            overflowY: 'auto',
                            bgcolor: 'background.paper',
                            boxShadow: 3,
                            zIndex: 1202,
                        }}
                    >
                        {searchResults.map((article) => (
                            <Card
                                key={article.id}
                                sx={{
                                    display: 'flex',
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}
                                onClick={() => handleSearchItemClick(article.id)}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{ width: 100, height: 100, objectFit: 'cover' }}
                                    image={article.mainImageUrl || '/placeholder-image.jpg'}
                                    alt={article.title}
                                />
                                <CardContent sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" component="div">
                                        {article.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {article.shortDescription}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        by {article.publisher.username} • {article.timeAgo}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>
        </ClickAwayListener>
    );





    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {isMobile && !searchOpen && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    {(!isMobile || !searchOpen) && (
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                flexGrow: 1,
                                cursor: 'pointer',
                            }}
                            onClick={() => navigate('/')}
                        >
                            Virtual Arena
                        </Typography>
                    )}

                    {!isMobile && searchBar}

                    {isMobile ? (
                        searchOpen ? (
                            <Box sx={{ width: '100%', px: 1 }}>
                                {searchBar}
                            </Box>
                        ) : (
                            <IconButton color="inherit" onClick={() => setSearchOpen(true)}>
                                <SearchIcon />
                            </IconButton>
                        )
                    ) : null}

                    {isAuthenticated && !searchOpen && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton color="inherit" onClick={() => navigate('/article/create')}>
                                <AddIcon />
                            </IconButton>

                            <IconButton color="inherit" onClick={handleNotificationMenu}>
                                <Badge badgeContent={4} color="error">
                                    <Notifications />
                                </Badge>
                            </IconButton>

                            <IconButton color="inherit" onClick={handleMenu}>
                                <Avatar sx={{ width: 32, height: 32 }} src={localStorage.getItem('avatarUrl')} />
                            </IconButton>
                        </Box>
                    )}

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {
                            navigate('/profile');
                            handleClose();
                        }}>
                            <ListItemIcon>
                                <Person fontSize="small" />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>

                    <Menu
                        anchorEl={notificationAnchorEl}
                        open={Boolean(notificationAnchorEl)}
                        onClose={handleNotificationClose}
                    >
                        <MenuItem>Notification 1</MenuItem>
                        <MenuItem>Notification 2</MenuItem>
                        <MenuItem>Notification 3</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;