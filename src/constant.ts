export const FLIGHT_STATUS = {
    SCHEDULED: 'scheduled',
    DEPARTED: 'departed',
    LANDED: 'landed',
    CANCELLED: 'cancelled',
  } as const;

  export const MONGODB = {
    FIELD_EXCLUSIONS: {
      DEFAULT: '-_id -__v',
      WITH_ID: '-__v',
      MINIMAL: '-_id -__v -createdAt -updatedAt',
    },
    PAGINATION: {
      DEFAULT_PAGE: 1,
      DEFAULT_LIMIT: 10,
      SORT_FIELD: 'departureTime',
      SORT_ORDER: 'asc'
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