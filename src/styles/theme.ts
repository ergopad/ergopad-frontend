import { createTheme } from '@mui/material/styles'
// import { Palette, PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary?: Palette['primary']
    quaternary?: Palette['primary']
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary']
    quaternary?: PaletteOptions['primary']
  }
}

export const themeSetup = {
  dark: {
    background: 'rgb( 29, 29, 32 )',
    greyBackground: 'rgb(46, 46, 51)',
    primaryText: 'rgb(244, 244, 245)',
    secondaryText: 'rgb(162, 162, 168)',
    borderColor: 'rgba(82,82,90,1)',
    dividerColor: 'rgba(255,255,255,0.08)',
    primaryMain: '#3ABAB4',
  },
}

// Create a theme instance.
let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      // main: 'rgb(58, 186, 180)',
      main: themeSetup.dark.primaryMain,
      // hover: '#4BD0C9',
      // active: 'rgba(49, 151, 149, 0.25)'
    },
    secondary: {
      main: '#9f7aea',
      // hover: '#B886F9',
      // active: 'rgba(128, 90, 213, 0.25)',
    },
    tertiary: {
      main: '#667eea',
      // hover: '#8096F7',
      // active: 'rgba(90, 103, 216, 0.25)'
    },
    quaternary: {
      main: 'rgb(237, 100, 166)',
    },
    background: {
      paper: 'rgba(23, 25, 29, 1)',
      default: themeSetup.dark.background,
      // grey: themeSetup.dark.greyBackground
    },
    text: {
      primary: themeSetup.dark.primaryText,
      secondary: themeSetup.dark.secondaryText,
      // tertiary: 'rgb(228, 228, 231)'
    },
    action: {
      hover: '#ffffff',
      // light: {},
    },
    // greyButton: {
    //   background: 'rgb(46, 46, 51)',
    //   hover: 'rgba(63,62,68,255)'
    // },
    // borderColor: themeSetup.dark.borderColor,
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          marginBottom: '1rem',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(95, 95, 99, 1)',
          },
        },
      },
    },
    // MuiAppBar: {
    //   variants: [
    //     {
    //       props: { color: 'background' },
    //       style: {
    //         background: themeSetup.dark.background
    //       }
    //     }
    //   ]
    // },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      variants: [
        {
          props: { variant: 'filled' },
          style: {
            '&:hover': {
              border: 'none',
            },
            // '& .MuiInputLabel-root': {
            //   '&.Mui-focused': {
            //     color: themeSetup.dark.secondaryText,
            //   },
            // },
          },
        },
      ],
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: themeSetup.dark.dividerColor,
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          borderStyle: 'solid',
          borderWidth: '1px',
          // '& input': {
          //   paddingTop: '7px',
          //   paddingBottom: '7px',
          // },
          '&:before': {
            display: 'none',
          },
          '&:after': {
            display: 'none',
          },
          borderColor: 'rgba(200, 225, 255, 0.2)',
          background:
            'radial-gradient(at right top, rgba(16,20,34,0.4), rgba(1, 4, 10, 0.4))',
          boxShadow: `2px 2px 5px 3px rgba(0,0,0,0.1)`,
          '&:hover': {
            borderColor: themeSetup.dark.primaryMain,
          },
        },
      },
    },
  },
})

theme.typography.h1 = {
  fontSize: '5rem',
  lineHeight: '1.1',
  color: theme.palette.text.primary,
  fontWeight: '700',
  letterSpacing: '-0.02em',
  marginBottom: '2rem',
  '@media (max-width:1200px)': {
    fontSize: '4.71rem',
  },
  '@media (max-width:1024px)': {
    fontSize: '3.9rem',
  },
  '@media (max-width:880px)': {
    fontSize: '3rem',
  },
}

theme.typography.h2 = {
  color: theme.palette.text.primary,
  fontWeight: '700',
  fontSize: '3.5rem',
  marginBottom: '1rem',
  '@media (max-width:880px)': {
    fontSize: '2.63rem',
  },
  lineHeight: '1.0',
  letterSpacing: '-0.02em',
}

theme.typography.h3 = {
  color: theme.palette.text.primary,
  letterSpacing: '-.02em',
  fontSize: '2.5rem',
  marginBottom: '1rem',
  fontWeight: '700',
}

theme.typography.h4 = {
  color: theme.palette.text.primary,
  letterSpacing: '-.02em',
  fontSize: '2rem',
  marginBottom: '1rem',
  fontWeight: '600',
}

theme.typography.h5 = {
  color: theme.palette.text.primary,
  letterSpacing: '-.02em',
  fontSize: '1.6rem',
  marginBottom: '1rem',
  fontWeight: '500',
}

theme.typography.h6 = {
  color: theme.palette.text.primary,
  letterSpacing: '-.02em',
  fontSize: '1.3rem',
  marginBottom: '1rem',
  fontWeight: '500',
}

theme.typography.subtitle1 = {
  fontSize: '1.25rem',
  lineHeight: '1.5',
  marginBottom: '1.5rem',
  letterSpacing: '-.02em',
  fontWeight: '400',
  fontFamily: 'Inter, sans-serif',
  color: theme.palette.text.secondary,
}

theme.typography.body2 = {
  color: theme.palette.text.secondary,
  fontSize: '1.125rem',
  marginBottom: '1rem',
  display: 'block',
}

export default theme
