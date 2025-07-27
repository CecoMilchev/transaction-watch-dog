# Configurations Service Architecture

## Overview
The **Configurations Service** is a REST API that manages transaction filter configurations. It provides CRUD operations for both simple and composite filters, publishes filter updates to Kafka, and serves as the configuration hub for the transaction monitoring system.

## Architecture Pattern
- **Pattern**: Layered Architecture with Dependency Injection
- **Framework**: Express.js REST API
- **Database**: MySQL with Sequelize ORM
- **Messaging**: Kafka producer for filter updates
- **DI Container**: Awilix with classic injection mode

## Core Components

### Controllers Layer
- **`filterDescriptorController.js`** - Handles CRUD operations for simple filters
- **`compositeFilterDescriptorController.js`** - Manages composite filters with multiple conditions

### Services Layer
- **`FilterDescriptorService`** - Business logic for simple filter operations
- **`CompositeFilterDescriptorService`** - Logic for composite filter management
- **`KafkaProducerService`** - Publishes filter updates to Kafka topics

### Data Models
- **`Filter`** - Individual filter conditions (from, to, value ranges)
- **`CompositeFilter`** - Container for multiple filters with logical operators
- **`CompositeFilterRule`** - Junction table linking composite filters to individual filters

### Routes
- **Simple Filters**: `/api/filters` - GET, POST, PUT, DELETE operations
- **Composite Filters**: `/api/composite-filters` - Complex filter management
- **Activation**: `/api/filters/:id/activate|deactivate` - Filter state control

## Key Features
- **Filter Types**: Simple (single condition) and Composite (multiple conditions with AND/OR logic)
- **State Management**: Active/inactive filter states with Kafka notifications
- **Real-time Updates**: Publishes filter changes to `filter-updates` Kafka topic
- **Validation**: Request validation middleware for data integrity

## Data Flow
1. Client requests filter operations via REST API
2. Controllers validate and delegate to services
3. Services perform database operations via Sequelize
4. Filter updates are published to Kafka for other services
5. Transactions service consumes these updates for real-time filtering

## Dependencies
- **Express.js** - REST API framework
- **Sequelize** - ORM for MySQL database operations
- **KafkaJS** - Message publishing to Kafka
- **Awilix** - Dependency injection container
