/**
 * Chat (the /chat inbox, every chat button, and the Socket.io connection behind it) is switched
 * off until the realtime backend is fixed (PM2 runs 2 workers without sticky sessions, so socket.io
 * polling fails with "Session ID unknown" and its long-held requests starve the browser's
 * connection pool). Set NEXT_PUBLIC_CHAT_ENABLED=true to bring it back; nothing else changes.
 */
export const CHAT_ENABLED = process.env.NEXT_PUBLIC_CHAT_ENABLED === "true";
