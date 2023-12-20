declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENV: string;
            PORT: number;
            DATABASE_URL: string;
            ALLOWEDORIGIN: Array;
            JWT_SECRET: string
            JWT_EXPIRES_IN: number
            JWT_RESETPASSWORDEXPIRETIME: number
        }
    }
}
export { };