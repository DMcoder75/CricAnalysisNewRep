import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 14px; /* Reduced from typical 16px */
  }

  body {
    font-family: ${theme.fonts.primary};
    background-color: ${theme.colors.background.main};
    color: ${theme.colors.text.primary};
    line-height: 1.4; /* Reduced from typical 1.5 or 1.6 */
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${theme.spacing.sm};
    line-height: 1.2;
  }

  h1 {
    font-size: 1.8rem; /* Reduced from typical 2rem+ */
  }

  h2 {
    font-size: 1.5rem; /* Reduced from typical 1.75rem */
  }

  h3 {
    font-size: 1.3rem; /* Reduced from typical 1.5rem */
  }

  h4 {
    font-size: 1.1rem; /* Reduced from typical 1.25rem */
  }

  h5, h6 {
    font-size: 1rem;
  }

  p {
    margin-bottom: ${theme.spacing.sm};
    font-size: 0.9rem; /* Reduced from typical 1rem */
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: 0.9rem; /* Reduced from typical 1rem */
  }

  /* Make tables more compact */
  table {
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    text-align: left;
    font-size: 0.85rem; /* Smaller font for table content */
  }

  /* Make cards more compact */
  .card {
    padding: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.md};
  }

  /* Reduce spacing in lists */
  ul, ol {
    padding-left: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.sm};
  }

  li {
    margin-bottom: ${theme.spacing.xs};
    font-size: 0.9rem;
  }

  /* Make form elements more compact */
  .form-group {
    margin-bottom: ${theme.spacing.sm};
  }

  input, select, textarea {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
  }

  /* Reduce button padding */
  button {
    padding: ${theme.spacing.xs} ${theme.spacing.md};
  }

  /* Reduce container padding */
  .container {
    padding: ${theme.spacing.sm};
  }

  /* Reduce grid gaps */
  .grid {
    gap: ${theme.spacing.sm};
  }
`;

export default GlobalStyles;
