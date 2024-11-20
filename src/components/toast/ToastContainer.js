import { Alert, Snackbar } from '@mui/material';
import { createContext, useContext, useState } from 'react';

// Create Toast Context
const ToastContext = createContext();

// Toast Provider Component
export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'info', // 'error' | 'warning' | 'info' | 'success'
    });

    const showToast = (message, severity = 'info') => {
        setToast({
            open: true,
            message,
            severity,
        });
    };

    const hideToast = () => {
        setToast(prev => ({
            ...prev,
            open: false,
        }));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Snackbar
                open={toast.open}
                autoHideDuration={6000}
                onClose={hideToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={hideToast}
                    severity={toast.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        maxWidth: '400px',
                        boxShadow: 3,
                    }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};

// Custom hook to use toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};