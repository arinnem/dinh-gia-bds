import { Pool } from 'pg';
export interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    max?: number;
    idleTimeoutMillis?: number;
    connectionTimeoutMillis?: number;
}
export declare const dbConfig: DatabaseConfig;
declare class DatabaseConnection {
    private pool;
    private static instance;
    private constructor();
    static getInstance(): DatabaseConnection;
    getPool(): Pool;
    query(text: string, params?: any[]): Promise<any>;
    getClient(): Promise<import("pg").PoolClient>;
    testConnection(): Promise<boolean>;
    close(): Promise<void>;
}
export { DatabaseConnection };
export default DatabaseConnection;
//# sourceMappingURL=database.d.ts.map