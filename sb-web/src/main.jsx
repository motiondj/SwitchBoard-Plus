import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import App from './App.jsx'
import store from './store'
import getTheme from './theme'
import './styles/switchboard-plus-styles.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

const AppWithTheme = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const theme = getTheme(isDarkMode ? 'dark' : 'light');

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
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