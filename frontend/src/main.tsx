import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!);
const queryClient = new QueryClient();

root.render(
    React.createElement(React.StrictMode, null,
        React.createElement(QueryClientProvider, { client: queryClient },
            React.createElement(App, null)
        )
    )
);

