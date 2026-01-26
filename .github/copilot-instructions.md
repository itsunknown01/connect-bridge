# Connect Bridge - AI Coding Agent Instructions

## Architecture Overview
Full-stack real-time chat application with React frontend, Node.js/Express backend, MySQL database via Drizzle ORM, and Socket.io for WebSockets. Uses ViteExpress for unified development server serving both API and SPA.

- **Frontend**: React 18 + TypeScript + Vite, Redux Toolkit for state, Socket.io-client for real-time, shadcn/ui + Tailwind CSS
- **Backend**: Node.js + Express + Socket.io server, JWT auth with refresh tokens in HTTP-only cookies
- **Database**: MySQL with Drizzle ORM schemas in `src/server/config/schema.ts`
- **Real-time**: Channel-based messaging with membership validation, online user tracking

## Critical Workflows
- **Development**: `npm run dev` starts nodemon-watched server + Vite dev server via ViteExpress on port 3000
- **Database**: `npm run db:push` syncs schema changes to local MySQL; `npm run db:studio` opens Drizzle Studio
- **Build**: `npm run build` builds client; `npm start` runs production server
- **Environment**: Requires `.env` with `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`; MySQL running locally

## Project-Specific Patterns
- **State Management**: Redux slices with RTK Query-style async thunks (e.g., `channelSlice.ts`); axiosPrivate with JWT interceptors for API calls
- **Authentication**: JWT access tokens in Redux, refresh tokens in cookies; automatic refresh on 403 responses
- **WebSocket**: Singleton `socketManager` connects on login, emits `join-channel` after Redux membership updates; validates membership server-side
- **Path Aliases**: `@` resolves to project root (Vite config); use `@/src/client/...` for client, `@/src/server/...` for server
- **Validation**: Zod schemas in `schemas/index.ts`; error handling via Redux slices + Sonner toasts
- **Components**: shadcn/ui in `src/client/components/ui/`; custom hooks in `src/client/pages/chat/hooks/`

## Key Files
- `src/server/main.ts`: ViteExpress setup with routes
- `src/server/config/websockets.ts`: Socket.io server with JWT auth and channel logic
- `src/client/redux/slices/channelSlice.ts`: Redux async thunk pattern example
- `src/client/helpers/api.ts`: Axios interceptors for JWT refresh
- `drizzle.config.ts`: Database config for MySQL "connect_bridge"</content>
<parameter name="filePath">c:\Users\Aryam\Desktop\Projects\connect-bridge\.github\copilot-instructions.md