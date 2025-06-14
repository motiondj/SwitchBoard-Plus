import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import { store } from './store'
import getTheme from './theme'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

const AppWithTheme = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(store.getState().ui.isDarkMode);
  const theme = getTheme(isDarkMode ? 'dark' : 'light');

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setIsDarkMode(store.getState().ui.isDarkMode);
    });
    return () => unsubscribe();
  }, []);

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