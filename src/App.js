import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/dashboard/Navbar';
import Home from './pages/Home';
import {CssBaseline, ThemeProvider, Box} from "@mui/material";
import theme from './theme';
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import EmailVerification from "./pages/auth/EmailVerification";
import PrivateRoutes from "./components/routing/PrivateRoutes";
import UserProfile from "./pages/profile/UserProfile";
import CreateArticle from "./pages/articles/CreateArticle";
import ArticleDetail from "./pages/articles/ArticleDetail";
import Error404 from "./pages/Error404";
import {ToastContainer} from "react-toastify";
import ScrollToTop from "./components/common/ScrollToTop";
import EditArticle from "./pages/articles/EditArticle";
import Footer from "./pages/dashboard/Footer";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                {/* Navbar should be outside Routes but inside Router */}
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <Box component="main" sx={{ flexGrow: 1 }}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path='/auth/sign-in' element={<SignIn />} />
                            <Route path='/auth/sign-up' element={<SignUp />} />
                            <Route path='/auth/verify-email/:verifyingEmail' element={<EmailVerification />} />

                            {/* Public Article Routes */}
                            <Route path='/article/:id' element={<ArticleDetail />} />

                            {/* Protected Routes */}
                            <Route element={<PrivateRoutes />}>
                                {/* User Profile & Settings */}
                                <Route path='/profile' element={<UserProfile />} />

                                {/* Article Management */}
                                <Route path='/article/create' element={<CreateArticle />} />
                                <Route path='/article/edit/:id' element={<EditArticle />} />
                            </Route>

                            {/* Default Routes */}
                            <Route path='/' element={<Home />} />
                            <Route path='*' element={<Error404 />} />
                        </Routes>
                    </Box>
                    <Footer />
                </Box>
                <ScrollToTop />
                <ToastContainer />
            </Router>
        </ThemeProvider>
    );
}

export default App;