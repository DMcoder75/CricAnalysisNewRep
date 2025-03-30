// Theme configuration with branding colors
const theme = {
  colors: {
    primary: '#002C54',    // Deep navy blue
    secondary: '#C5001A',  // Bright red
    tertiary: '#FDF6F6',   // Pale pink
    background: {
      card: '#FFFFFF',
      main: '#F8F9FA',
      light: '#FFFFFF',
      dark: '#F0F2F5',
    },
    text: {
      primary: '#333333',
      secondary: '#6C757D',
      light: '#FFFFFF',
    },
    lightGray: '#F5F5F5',
    darkGray: '#666666',
    success: '#28A745',    // Green for positive outcomes
    warning: '#FFC107',    // Yellow for warnings
    danger: '#DC3545',     // Red for errors
    error: '#DC3545',      // Red for errors
    info: '#17A2B8',       // Blue for information
    muted: '#6C757D',      // Gray for muted text
    border: '#DEE2E6',     // Light gray for borders
    series: {
      ongoing: {
        bg: '#e8f5e9',
        text: '#2e7d32',
        border: '#4caf50'
      },
      upcoming: {
        bg: '#e3f2fd',
        text: '#1565c0',
        border: '#2196f3'
      },
      completed: {
        bg: '#f5f5f5',
        text: '#616161',
        border: '#9e9e9e'
      },
      live: {
        bg: '#ffebee',
        text: '#c62828',
        border: '#f44336'
      }
    },
    status: {
      live: '#c62828',      // Red for live matches
      upcoming: '#1565c0',  // Blue for upcoming matches
      completed: '#616161', // Gray for completed matches
    },
  },
  fonts: {
    primary: '"Roboto", sans-serif',
    secondary: '"Open Sans", sans-serif',
    monospace: '"Courier New", monospace',
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '1024px',
    largeDesktop: '1200px',
  },
  spacing: {
    xs: '2px',    // Reduced from 4px
    sm: '4px',    // Reduced from 8px
    md: '8px',    // Reduced from 16px
    lg: '16px',   // Reduced from 24px
    xl: '24px',   // Reduced from 32px
    xxl: '32px',  // Reduced from 48px
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.2s ease',
    slow: 'all 0.4s ease',
  },
  zIndices: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
  },
  teamColors: {
    MI: '#004BA0',
    CSK: '#FFFF00',
    RCB: '#EC1C24',
    KKR: '#3A225D',
    DC: '#0078BC',
    PBKS: '#ED1B24',
    RR: '#254AA5',
    SRH: '#F26522',
    GT: '#1B2133',
    LSG: '#A72056',
  },
};

// Asset paths
const ASSETS_PATH = {
  TEAMS: '/assets/images/teams/',
  PLAYERS: '/assets/images/players/',
  ICONS: '/assets/images/icons/',
  SITELOGO: '/assets/images/sitelogo/'
};

// Team logo mappings - using official logos
const TEAM_LOGO_MAP = {
  CSK: 'official_logos/csk.png',
  MI: 'official_logos/mi.jpg',
  RCB: 'official_logos/rcb.jpg',
  DC: 'official_logos/dc.png',
  KKR: 'official_logos/kkr.png',
  PBKS: 'official_logos/pbks.jpg',
  RR: 'official_logos/rr.jpg',
  SRH: 'official_logos/srh.png',
  GT: 'gt.svg',
  LSG: 'lsg.svg',
  default: 'default.svg'
};

// Player image mappings
const PLAYER_IMAGE_MAP = {
  // Default image for players without specific images
  default: 'default.png'
  // Add specific player mappings as needed
};

// Icon mappings for analytics page
const ICONS = {
  total_matches: 'total_matches.svg',
  completed_matches: 'completed_matches.svg',
  upcoming_matches: 'upcoming_matches.svg',
  runs_scored: 'runs_scored.svg',
  wickets_taken: 'wickets_taken.svg',
  highest_score: 'highest_score.svg',
  most_wins: 'most_wins.svg',
  batting_average: 'batting_average.svg',
  default: 'default.svg'
};

// Export all theme configurations
theme.ASSETS_PATH = ASSETS_PATH;
theme.TEAM_LOGO_MAP = TEAM_LOGO_MAP;
theme.PLAYER_IMAGE_MAP = PLAYER_IMAGE_MAP;
theme.ICONS = ICONS;
theme.SITE_LOGO = 'CricketHattrickLogo.png';

export default theme;
