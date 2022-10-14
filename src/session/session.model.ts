import { Context, session, Telegraf } from "telegraf";

interface SessionData {
    messageCount: number;
    // ... more session data go here
}

// Define your own context type
export interface MyContext extends Context {
    session?: SessionData;
    // ... more props go here
}