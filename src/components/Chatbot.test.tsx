import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Chatbot from './Chatbot';
import axios, { AxiosStatic } from 'axios';

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<AxiosStatic>;

describe('Chatbot Component', () => {
    test('renders the chatbot correctly', () => {
        render(<Chatbot />);

        // Check if chatbot avatar and title are present
        expect(screen.getByText("Hey👋, I'm Ava")).toBeInTheDocument();
        expect(screen.getByText('Ask me anything or pick a place to start')).toBeInTheDocument();

        // Check if close button is rendered
        expect(screen.getByLabelText('close')).toBeInTheDocument();
    });

    test('chatbot closes when the close button is clicked', () => {
        render(<Chatbot />);

        // Check if the chatbot is initially present
        expect(screen.getByText("Hey👋, I'm Ava")).toBeInTheDocument();

        // Click the close button
        fireEvent.click(screen.getByLabelText('close'));

        // Ensure chatbot is no longer visible
        expect(screen.queryByText("Hey👋, I'm Ava")).not.toBeInTheDocument();
    });

    test('renders Create Report and Call Lead buttons', () => {
        render(<Chatbot />);

        // Check if buttons are present
        expect(screen.getByText('Create Report this month')).toBeInTheDocument();
        expect(screen.getByText('Call Lead')).toBeInTheDocument();
    });
});
