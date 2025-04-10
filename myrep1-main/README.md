# AI Chatbot

A modern AI-powered chatbot built with Node.js, Express, and OpenAI's GPT model.

## Features

- Real-time chat interface
- AI-powered responses using OpenAI's GPT model
- Modern and responsive UI
- Easy to deploy and use

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **AI Integration**: OpenAI API
- **Development**: Vite

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Param031010/Chatbot1.git
cd Chatbot1
```

2. Install dependencies for both client and server:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Running the Application

1. Start the server:
```bash
cd server
npm run server
```

2. Start the client:
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
Chatbot1/
├── client/              # Frontend code
│   ├── assets/         # Images and icons
│   ├── public/         # Static files
│   ├── script.js       # Client-side JavaScript
│   └── style.css       # Styles
├── server/             # Backend code
│   ├── server.js       # Express server
│   └── package.json    # Server dependencies
└── README.md           # Project documentation
```

## Usage

1. Type your message in the input field
2. Press Enter or click the send button
3. Wait for the AI's response

## Deployment

The application can be deployed on platforms like:
- Vercel
- Heroku
- Render

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.

## Contact

For any queries, please reach out through GitHub issues. 