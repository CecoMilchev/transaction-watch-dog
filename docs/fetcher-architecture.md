# Fetcher Service Architecture

## Overview
The **Fetcher Service** monitors Ethereum blockchain for new blocks, stores them temporarily in Redis, and publishes delayed blocks to Kafka for transaction processing. It implements a delay mechanism to ensure block finality before processing transactions.

## Architecture Pattern
- **Pattern**: Event-Driven Architecture with WebSocket Streaming
- **Real-time**: WebSocket connection to Infura for live block data
- **Storage**: Redis for temporary block storage and pub/sub
- **Messaging**: Kafka producer for delayed block notifications
- **DI Container**: Awilix with proxy injection mode

## Core Components

### Block Processing Pipeline
- **`InfuraWebClient`** - WebSocket client for real-time block streaming from Infura
- **`BlockProcessor`** - Processes incoming blocks and detects reorganizations
- **`BlockStorageService`** - Stores blocks in Redis with TTL and publishes events
- **`BlockDelayService`** - Manages block maturity delays before Kafka publishing

### Services Layer
- **`KafkaProducerService`** - Publishes matured blocks to Kafka topics
- **`BlockStorageService`** - Redis operations for block persistence
- **`BlockDelayService`** - Delay mechanism with configurable block confirmations

### Data Flow Architecture
```
Infura WebSocket → BlockProcessor → BlockStorageService → Redis
                                                      ↓
Redis Pub/Sub → BlockDelayService → KafkaProducerService → Kafka
```

## Key Features
- **Real-time Block Streaming**: WebSocket connection to Infura mainnet
- **Block Finality**: Configurable delay (default: 2 blocks) before processing
- **Reorganization Detection**: Compares parent hashes to detect chain reorgs
- **Redis Storage**: Temporary block storage with 24-hour TTL
- **Event-Driven**: Redis pub/sub for internal communication
- **Kafka Publishing**: Publishes matured blocks to `blocks-delayed` topic

## Block Delay Mechanism
1. **New Block Reception**: Receives blocks via WebSocket from Infura
2. **Storage**: Stores block in Redis with TTL and sorted set indexing
3. **Pub/Sub Notification**: Publishes block event to Redis channel
4. **Delay Processing**: BlockDelayService waits for configured confirmations
5. **Maturity Check**: Processes blocks that are `current_block - delay_blocks` old
6. **Kafka Publishing**: Sends matured blocks to transactions service via Kafka

## Configuration
- **Delay Blocks**: Default 2 block confirmations for finality
- **Redis TTL**: 24-hour block storage retention
- **Infura WebSocket**: Real-time connection to Ethereum mainnet
- **Kafka Topics**: `blocks-delayed` for matured block notifications

## Dependencies
- **WebSocket** - Real-time connection to Infura
- **Redis (ioredis)** - Block storage and pub/sub messaging
- **KafkaJS** - Message publishing to Kafka
- **Ethers.js** - Ethereum provider utilities
- **Awilix** - Dependency injection container
