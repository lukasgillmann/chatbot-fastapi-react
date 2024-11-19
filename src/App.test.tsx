// src/App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for the jest-dom matchers
import App from './App';

describe('App Component', () => {
  test('renders the Chatbot component', () => {
    // Render the App component
    render(<App />);

    // Check if the Chatbot component's content is present in the DOM
    expect(screen.getByText("Hey👋, I'm Ava")).toBeInTheDocument();
    expect(screen.getByText('Ask me anything or pick a place to start')).toBeInTheDocument();
  });
});
