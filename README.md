author:@JianZhao
# Flight Logs API

A robust RESTful API service for managing aircraft flight logs, built with Express.js and TypeScript.

## Overview

This API provides comprehensive flight logging capabilities, including flight tracking, status management, and analytics. It's designed to be scalable, maintainable, and easy to integrate with frontend applications.

## Features

- ✈️ Flight log management with pagination and sorting
-  Aircraft-specific flight queries
-  Flight hours calculation and analytics
-  Status-based filtering
-  Advanced search capabilities

## API Documentation

### Base URL

The base URL for all API endpoints is:

```
http://localhost:3000/api/v1/flights
```


### Endpoints

#### 1. Get Flight Logs
http
GET /

Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortField` (optional): Field to sort by (default: 'departureTime')
- `sortOrder` (optional): Sort direction ('asc' or 'desc', default: 'asc')


#### 2. Get Aircraft-Specific Flights

http
GET /aircraft/:aircraftId


Query Parameters:
- `status` (optional): Filter by flight status

#### 3. Calculate Total Flight Hours

http
GET /total-hours

Query Parameters:
- `startDate` (required): Start date (ISO format)
- `endDate` (required): End date (ISO format)


## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies
3. Create environment file
4. Configure environment variables
5. Start the server