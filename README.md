# transaction-watch-dog
An application that tracks all ETH transactions through Infura. Accepts rule sets to execute and store transactions in rdb.

> For a step-by-step walkthrough check out the [dedicated Walkthrough page](docs/WALKTHROUGH.md).

## Quick Start

### Prerequisites
- Node.js 16+
- Docker & Docker Compose
- Infura API key (free at infura.io)

### Setup & Run
```bash
# 1. Install dependencies and setup environment files
npm run setup

# 2. Start infrastructure (Kafka, Redis, MySQL)
docker-compose up -d

# 3. Add your Infura API key to src/fetcher/.env
# Edit: INFURA_API_KEY=your_actual_key_here

# 4. Wait ~60 seconds for databases, then initialize
npm run setup:db

# 5. Start all services
npm start
```

### Services
- **Configurations** (port 3000): REST API for managing transaction filters
- **Fetcher**: Monitors Ethereum blockchain via Infura WebSocket
- **Transactions**: Processes and stores filtered transactions

### Monitoring
- Kafka UI: http://localhost:8080
- Configuration API: http://localhost:3000/api
