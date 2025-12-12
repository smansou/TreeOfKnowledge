import { mockDataSource } from "./mock-data-source";
import type { DataSource } from "./types";

// Environment variable to control data source
const USE_MOCKS =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

// TODO: Replace with real API data source when backend is ready
// import { apiDataSource } from './api-data-source';

// Easy switching between mock and real data
export const dataSource: DataSource = USE_MOCKS
  ? mockDataSource
  : mockDataSource; // TODO: Replace with apiDataSource when ready

// Export types for convenience
export type { DataSource } from "./types";
export { mockDataSource };
