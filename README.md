# IPL Cricket Analytics

A comprehensive cricket analytics application focused on the Indian Premier League (IPL) with real-time points table updates, team statistics, and match data visualization.

## Features

- **Live Points Table**: Real-time IPL points table with team standings, wins, losses, and net run rate
- **Multi-level Data Retrieval**: Fetches data from CricAPI with robust fallback mechanisms
- **Database Caching**: Stores points table data in MySQL for efficient retrieval
- **Responsive UI**: Modern interface with IPL branding and team logos

## Technology Stack

- **Frontend**: React.js with styled-components
- **Backend**: Node.js with Express
- **Database**: MySQL for data persistence
- **API Integration**: Direct integration with CricAPI for live data

## Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL Server
- CricAPI Key

### Installation

1. Clone the repository:
```
git clone https://github.com/DMcoder75/CricAnalysisNewRep.git
```

2. Install dependencies:
```
npm install
cd server
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following:
```
CRICAPI_KEY=your_cricapi_key
IPL_SERIES_ID=d5a498c8-7596-4b93-8ab0-e0efc3345312
```

4. Set up the database:
```
cd server
node initDatabase.js
```

5. Start the server:
```
npm start
```

6. In a new terminal, start the client:
```
npm start
```

## License

This project is licensed under the MIT License.
