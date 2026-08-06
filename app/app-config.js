/**
 * Конфигурация приложения — всё в одном месте.
 */
export const APP_CONFIG = {
    supabase: {
        // ⚠️ ВСТАВЬ СВОИ ДАННЫЕ!
        url: 'https://mpganamwcjxvnmqzqdi.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wZ2FuYW13Y2p4dm5tcXpxZHFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NzgzMzYsImV4cCI6MjEwMTU1NDMzNn0.MWsBCuaJ8ON8Nf5D8F-U_AA8oRraf4DdIGriNHucj4A'
    },
    routes: {
        ideas: '/ideas',
        posts: '/posts',
        about: '/about',
        profile: '/profile',
        settings: '/settings'
    },
    theme: {
        default: 'dark',
        storageKey: 'xgame-theme'
    },
    sandbox: {
        maxHistory: 10,
        storageKey: 'sandbox-history'
    },
    pagination: {
        pageSize: 10
    }
};