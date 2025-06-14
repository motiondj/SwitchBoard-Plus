import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import store from './store'
import getTheme from './theme'
import './index.css'
import './styles/global.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

const AppWithTheme = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const theme = getTheme(isDarkMode ? 'dark' : 'light');

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  );
};

root.render(
  <React.StrictMode>
    <AppWithTheme />
  </React.StrictMode>
); 