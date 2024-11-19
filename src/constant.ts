export const FLIGHT_STATUS = {
  SCHEDULED: "scheduled",
  DEPARTED: "departed",
  LANDED: "landed",
  CANCELLED: "cancelled",
} as const;

export const ALLOWED_SORT_FIELDS = {
  DEPARTURE_TIME: "departureTime",
  ARRIVAL_TIME: "arrivalTime",
  STATUS: "status",
  AIRCRAFT_ID: "aircraftId",
} as const;

export const MONGODB = {
  FIELD_EXCLUSIONS: {
    DEFAULT: "-__v",
    MINIMAL: "-__v -createdAt -updatedAt",
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    SORT_FIELD: "departureTime",
    SORT_ORDER: "asc",
  },
  SORT_ORDERS: {
    ASC: 1,
    DESC: -1,
  },
} as const;

export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const ERROR_MESSAGES = {
  PAGINATION: {
    INVALID_PAGE: "Page number must be greater than 0",
    INVALID_LIMIT: "Limit must be between 1 and 100",
    INVALID_SORT_FIELD: "Invalid sort field provided",
    INVALID_SORT_ORDER: 'Sort order must be either "asc" or "desc"',
  },
  DATABASE: {
    CONNECTION_ERROR: "Database connection error",
    QUERY_ERROR: "Error fetching data from database",
    NOT_FOUND: "Resource not found",
  },
  VALIDATION: {
    INVALID_ID: "Invalid ID format",
    INVALID_REQUEST: "Invalid Request",
    REQUIRED_FIELDS: "Required fields are missing",
    INVALID_STATUS: "Invalid status provided",
    INVALID_DATE_FORMAT: "Invalid date format",
  },
  SERVER: {
    INTERNAL_SERVER_ERROR: "Internal Server Error",
  },
} as const;

export const MAX_NUMBER_OF_RECORDS = 100000;