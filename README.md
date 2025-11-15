# Poo
A simple trading platform built with Node.js and Express

## Features
- Real-time stock price updates
- Buy/sell trading functionality
- Portfolio tracking with P&L calculations
- Transaction history
- Responsive design

## Technologies
- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Architecture**: RESTful API

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Poo
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure
```
Poo/
├── public/           # Frontend files
│   ├── index.html   # Main HTML file
│   ├── styles.css   # Styles
│   └── app.js       # Client-side JavaScript
├── server.js        # Express server
├── package.json     # Dependencies
└── README.md        # Documentation
```

## API Endpoints

### GET /api/prices
Returns current stock prices

### POST /api/trade
Execute a trade (buy/sell)

Request body:
```json
{
  "symbol": "AAPL",
  "quantity": 10,
  "type": "buy"
}
```

## Development

To run in development mode:
```bash
npm run dev
```

## Future Enhancements
- Database integration for persistent data
- User authentication
- Real-time WebSocket updates
- Historical price charts
- Advanced order types (limit, stop-loss)

## License
ISC
