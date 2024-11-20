// src/theme/index.js
import { createTheme } from '@mui/material/styles';

const colorSchemes = {
    teal: {
        primary: '#16e7c8',
        secondary: '#0890ff',
        text: {
            primary: '#2C3E50',    // Deep blue-gray
            secondary: '#34495E',   // Softer blue-gray
            light: '#7F8C8D'        // Medium gray
        }
    },
    purple: {
        primary: '#7C3AED',
        secondary: '#5B21B6',
        text: {
            primary: '#2A2F45',    // Deep purple-gray
            secondary: '#424867',   // Medium purple-gray
            light: '#6B7280'        // Balanced gray
        }
    },
    ocean: {
        primary: '#0EA5E9',
        secondary: '#0369A1',
        text: {
            primary: '#234E6F',    // Deep ocean blue
            secondary: '#2C5B7F',   // Medium ocean blue
            light: '#62849F'        // Light ocean blue
        }
    },
    forest: {
        primary: '#10B981',
        secondary: '#059669',
        text: {
            primary: '#233F39',    // Deep forest
            secondary: '#345E54',   // Medium forest
            light: '#5E7A73'        // Light forest
        }
    },
    sunset: {
        primary: '#F59E0B',
        secondary: '#B45309',
        text: {
            primary: '#433422',    // Deep warm brown
            secondary: '#5C4934',   // Medium warm brown
            light: '#8C7355'        // Light warm brown
        }
    },
    cherry: {
        primary: '#EC4899',
        secondary: '#BE185D',
        text: {
            primary: '#442838',    // Deep rose
            secondary: '#5E364D',   // Medium rose
            light: '#8E6B7D'        // Light rose
        }
    },
    midnight: {
        primary: '#6366F1',
        secondary: '#4F46E5',
        text: {
            primary: '#2A2B40',    // Deep indigo gray
            secondary: '#3E3F5C',   // Medium indigo gray
            light: '#666875'        // Light indigo gray
        }
    },
    earth: {
        primary: '#78350F',
        secondary: '#92400E',
        text: {
            primary: '#3D2A23',    // Deep earth brown
            secondary: '#574439',   // Medium earth brown
            light: '#8C7B73'        // Light earth brown
        }
    }
};

// Choose your color scheme here
const selectedScheme = colorSchemes.midnight; // Change this to use different schemes

const theme = createTheme({
    palette: {
        primary: {
            main: selectedScheme.primary,
        },
        secondary: {
            main: selectedScheme.secondary,
        },
        text: {
            primary: selectedScheme.text.primary,
            secondary: selectedScheme.text.secondary,
        }
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            color: selectedScheme.text.primary,
            fontWeight: 700
        },
        h2: {
            color: selectedScheme.text.primary,
            fontWeight: 600
        },
        h3: {
            color: selectedScheme.text.primary,
            fontWeight: 600
        },
        h4: {
            color: selectedScheme.text.primary,
            fontWeight: 600
        },
        h5: {
            color: selectedScheme.text.primary,
            fontWeight: 600
        },
        h6: {
            color: selectedScheme.text.primary,
            fontWeight: 600
        },
        body1: {
            color: selectedScheme.text.secondary
        },
        body2: {
            color: selectedScheme.text.light
        },
        subtitle1: {
            color: selectedScheme.text.secondary
        },
        subtitle2: {
            color: selectedScheme.text.light
        }
    },
    components: {
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'medium',
            }
        },
        MuiButton: {
            defaultProps: {
                size: 'large',
            },
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                }
            }
        }
    }
});

export default theme;



