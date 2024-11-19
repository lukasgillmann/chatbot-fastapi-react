import React, { useState, useMemo } from 'react';
import SendIcon from '@mui/icons-material/Send';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

import {
    Button,
    IconButton,
    TextField,
    Box,
    Stack,
    Typography,
    Avatar,
    Paper,
    Select,
    FormControl,
    MenuItem,
    Popover,
    SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)({
    backgroundColor: 'white',
    borderRadius: '32px',
    width: 'fit-content',
    padding: '0 12px',
    textTransform: 'none'
});

const ColorButton = styled(Button)({
    width: 40,
    height: 40,
    minWidth: 0,
    borderRadius: '50%',
});

const CloseButton = styled(IconButton)({
    position: 'absolute',
    right: '-10px',
    top: '-12px'
});

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState([
        { id: 1, from: 'bot', text: 'Hi Jane, Amazing how Mosey is simplifying state compliance for businesses across the board!', editable: false },
    ]);
    const [userMessage, setUserMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [selectedColor, setSelectedColor] = useState('#733DF9'); // Default color
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mode, setMode] = useState('basic'); // Basic or Smart mode

    // replace YOUR_GROQ_API_KEY to your api token
    const url = useMemo(() => mode === 'smart' ? 'https://groq-api.com/send-message' : 'http://127.0.0.1:8000/send-message/', [mode])
    const headers = useMemo(() => mode === 'smart' ? { Authorization: 'Bearer YOUR_GROQ_API_KEY' } : {}, [mode])

    const handleSendMessage = async (message: string) => {
        if (message.trim()) {
            // Add user's message to the chat
            const newMessage = { id: Date.now(), from: 'user', text: message, editable: false };
            setMessages([...messages, newMessage]);

            // Send the message to FastAPI backend or Groq LLM API if smart mode
            const data = { from_user: 'user', text: message };

            try {
                const response = await axios.post(url, data, { headers });

                // Add bot's response to the chat
                const botMessage = response.data.response;
                setMessages([...messages, newMessage, { id: Date.now(), from: 'bot', text: botMessage, editable: false }]);

            } catch (error) {
                console.error('Error sending message:', error);
            }

            // Clear the input field
            setUserMessage('');
        }
    };

    const createReport = () => handleSendMessage('Create Report this month');
    const callLead = () => handleSendMessage('Call Lead');
    const handleToggleChat = () => setIsChatOpen(!isChatOpen);

    const openSettings = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const closeSettings = () => {
        setAnchorEl(null);
    };

    const changeColor = (color: string) => {
        setSelectedColor(color);
        closeSettings();
    };

    const isSettingsOpen = Boolean(anchorEl);
    const popoverId = isSettingsOpen ? 'color-popover' : undefined;

    const handleModeChange = (event: SelectChangeEvent) => {
        setMode(event.target.value as string);
    };

    const toggleEditMode = (id: number) => {
        const updatedMessages = messages.map(msg => msg.id === id ? { ...msg, editable: !msg.editable } : msg)
        setMessages(updatedMessages);
    }

    // Edit message
    const handleEditMessage = async (id: number) => {
        const index = messages.findIndex(msg => msg.id === id)
        const updatedMessages = messages.map(msg =>
            msg.id === id ? { ...msg, editable: !msg.editable } : msg
        );

        // Send the message to FastAPI backend or Groq LLM API if smart mode
        const data = { from_user: 'user', text: messages[index]!.text };

        try {
            const response = await axios.post(url, data, { headers });

            // Add bot's response to the chat
            const botMessage = response.data.response;
            updatedMessages[index + 1].text = botMessage
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setMessages(updatedMessages);
    };

    // Delete message
    const handleDeleteMessage = (id: number) => {
        const updatedMessages = messages.filter(msg => msg.id !== id);
        setMessages(updatedMessages);
    };

    if (!isChatOpen)
        return (
            <Paper
                elevation={3}
                style={{
                    maxWidth: 350,
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 1000,
                    borderRadius: '100%'
                }}
            >
                <IconButton size="large" onClick={handleToggleChat} aria-label="delete">
                    <EmailOutlinedIcon />
                </IconButton>
            </Paper>
        );

    return (
        <Paper
            elevation={3}
            style={{
                padding: 20,
                maxWidth: 350,
                position: 'fixed',
                bottom: 20,
                right: 20,
                display: 'flex',
                flexDirection: 'column',
                height: '80vh',
                zIndex: 1000,
                borderRadius: '16px'
            }}
        >
            <Box display="flex" flexDirection="column" alignItems="center" position="relative">
                <Avatar alt="Ava" src="https://i.pravatar.cc/300" />
                <Typography variant="h6" gutterBottom>
                    Hey👋, I'm Ava
                </Typography>
                <Typography variant="body2">Ask me anything or pick a place to start</Typography>
                <CloseButton aria-label="close" onClick={handleToggleChat}>
                    <CloseIcon />
                </CloseButton>
            </Box>

            {/* Chat Messages Section */}
            <Box
                my={2}
                flexGrow={1}
                overflow="auto"
                sx={{
                    /* Hide scrollbars */
                    scrollbarWidth: 'none', /* Firefox */
                    '&::-webkit-scrollbar': {
                        display: 'none', /* Chrome, Safari, Webkit */
                    }
                }}
            >
                {messages.map((msg, index) => (
                    <Box
                        key={index}
                        mb={2}
                        display="flex"
                        flexDirection={msg.from === 'bot' ? 'row' : 'row-reverse'}
                        alignItems="start"
                    >
                        <Avatar
                            alt={msg.from}
                            src={msg.from === 'bot' ? 'https://i.pravatar.cc/300?img=5' : 'https://i.pravatar.cc/300?u=user'}
                        />
                        <Box mx={1} p={2} sx={{ borderRadius: msg.from === 'bot' ? '0 32px 32px 32px' : '32px 0 32px 32px' }} bgcolor={msg.from === 'bot' ? '#F9FAFB' : selectedColor} color={msg.from === 'bot' ? '#000' : '#fff'} maxWidth="70%">
                            {msg.editable ? (
                                <TextField
                                    fullWidth
                                    value={msg.text}
                                    onChange={(e) => setMessages(messages.map(m => (m.id === msg.id ? { ...m, text: e.target.value } : m)))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleEditMessage(msg.id)}
                                />
                            ) : (
                                <Typography>{msg.text}</Typography>
                            )}
                        </Box>
                        {msg.from !== 'bot' && (
                            <Stack direction="row" gap={1}>
                                {msg.editable ?
                                    <IconButton size="small" onClick={() => handleEditMessage(msg.id)}>
                                        <SaveIcon />
                                    </IconButton>
                                    :
                                    <IconButton size="small" onClick={() => toggleEditMode(msg.id)}>
                                        <EditIcon />
                                    </IconButton>
                                }
                                <IconButton size="small" onClick={() => handleDeleteMessage(msg.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        )}
                    </Box>
                ))}
                <Stack gap={1} ml={6}>
                    <StyledButton sx={{ borderColor: selectedColor, color: selectedColor }} onClick={createReport} variant="outlined">
                        Create Report this month
                    </StyledButton>
                    <StyledButton sx={{ borderColor: selectedColor, color: selectedColor }} onClick={callLead} variant="outlined">
                        Call Lead
                    </StyledButton>
                </Stack>
            </Box>

            {/* Input Field and Buttons */}
            <Box mt={2}>
                <FormControl sx={{ borderRadius: 4 }} fullWidth>
                    <TextField
                        label="Your Questions"
                        variant="outlined"
                        data-testid="user"
                        fullWidth
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();  // Prevents the form from submitting if it's inside a form element
                                handleSendMessage(userMessage);  // Call the function to send the message
                            }
                        }}
                        InputProps={{
                            endAdornment:
                                <IconButton aria-label="delete" onClick={() => handleSendMessage(userMessage)}>
                                    <SendIcon />
                                </IconButton>
                        }}
                    />
                </FormControl>
            </Box>

            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center">
                    <Typography variant="body2">Mode</Typography>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select value={mode} onChange={handleModeChange}>
                            <MenuItem value="basic">Basic</MenuItem>
                            <MenuItem value="smart">Smart</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
                <Box>
                    <IconButton aria-label="delete" onClick={openSettings}>
                        <SettingsOutlinedIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Settings Dialog */}
            <Popover
                id={popoverId}
                open={isSettingsOpen}
                anchorEl={anchorEl}
                onClose={closeSettings}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Stack p={1} gap={2}>
                    <ColorButton sx={{ backgroundColor: '#733DF9' }} onClick={() => changeColor('#733DF9')} />
                    <ColorButton sx={{ backgroundColor: '#4CAF50' }} onClick={() => changeColor('#4CAF50')} />
                    <ColorButton sx={{ backgroundColor: '#FF5722' }} onClick={() => changeColor('#FF5722')} />
                </Stack>
            </Popover>
        </Paper>
    );
};

export default Chatbot;
