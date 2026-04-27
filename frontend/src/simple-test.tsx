import React from 'react';

const SimpleTest = () => {
    return React.createElement('div', {
        style: {
            padding: '40px',
            fontFamily: 'system-ui',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center' as const,
            minHeight: '100vh'
        }
    },
        React.createElement('h1', { style: { fontSize: '3rem', marginBottom: '20px' } }, '🍳 Kitchen Queue'),
        React.createElement('p', { style: { fontSize: '1.5rem' } }, 'React + Vite Working!'),
        React.createElement('p', null, 'Open localhost:5173 - Full app ready'),
        React.createElement('button', {
            style: {
                padding: '15px 30px',
                fontSize: '1.2rem',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                marginTop: '20px'
            },
            onClick: () => alert('Kitchen Queue System Fully Functional!')
        }, 'Test Click')
    );
};

export default SimpleTest;

