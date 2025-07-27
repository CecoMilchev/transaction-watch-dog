# Transactions Service Architecture

## Overview
The **Transactions Service** processes blockchain transactions by consuming matured blocks from Kafka, fetching transaction details from Ethereum via Infura, applying filters, and storing matched transactions in MySQL. It serves as the core transaction monitoring and filtering engine.

## Architecture Pattern
- **Pattern**: Event-Driven Processing with Message Consumers
- **Processing**: Kafka consumers for block and configuration updates
- **Filtering**: Dynamic filter application based on configuration updates
- **Storage**: MySQL database for filtered transaction persistence
- **DI Container**: Awilix with proxy injection mode

## Core Components

### Processing Pipeline
- **`BlockConsumer`** - Consumes matured blocks from Kafka `blocks-delayed` topic
- **`TransactionProcessor`** - Orchestrates transaction processing workflow
- **`TransactionDetailsFetcher`** - Fetches full transaction details from Infura with rate limiting
- **`FilterProcessor`** - Applies active filters to transaction data
- **`TransactionService`** - Persists matched transactions to MySQL database

### Configuration Management
- **`ConfigConsumer`** - Consumes filter updates from Kafka `filter-updates` topic
- **`FilterProcessor`** - Maintains active filter state and applies filtering logic

### Data Models
- **`FilteredTransaction`** - Sequelize model for storing matched transactions with filter references

## Key Features
- **Block Processing**: Processes matured blocks with transaction hash extraction
- **Rate-Limited Fetching**: Batched transaction detail fetching with Infura API limits
- **Dynamic Filtering**: Real-time filter updates via Kafka configuration messages
- **Last Activated Filter**: Uses most recently activated filter for transaction matching
- **Batch Persistence**: Efficient bulk insert of matched transactions

## Processing Workflow
1. **Block Reception**: Receives matured blocks from `blocks-delayed` Kafka topic
2. **Hash Extraction**: Extracts transaction hashes from block data via Ethereum provider
3. **Detail Fetching**: Fetches full transaction details in rate-limited batches
4. **Filter Application**: Applies last activated filter to transaction batch
5. **Persistence**: Stores matched transactions with filter ID in MySQL
6. **Configuration Updates**: Dynamically updates active filters via Kafka

## Rate Limiting Strategy
- **Batch Size**: 2 transactions per batch (configurable for testing)
- **Rate Limit**: 10 requests/second to respect Infura quotas
- **Credit Management**: 500 credits/second limit with 80 credits per transaction
- **Event Emission**: Emits `batchComplete` events for processed batches

## Filter Management
- **Active Filters**: Maintains map of currently active filters
- **Last Activated**: Uses most recently activated filter for processing
- **Configuration Updates**: Real-time filter state updates via Kafka
- **Filter Engine**: Applies filter conditions to transaction data

## Data Flow
```
Kafka (blocks-delayed) → BlockConsumer → TransactionProcessor
                                              ↓
TransactionDetailsFetcher → FilterProcessor → TransactionService
                                              ↓
                                          MySQL Database
```

## Dependencies
- **KafkaJS** - Message consumption from Kafka topics
- **Ethers.js** - Ethereum provider for blockchain interaction
- **Sequelize** - ORM for MySQL transaction storage
- **MySQL2** - Database connection for filtered transactions
- **Awilix** - Dependency injection container
