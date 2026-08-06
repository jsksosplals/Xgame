/**
 * Все события приложения — в одном месте.
 * Это как API для коммуникации между модулями.
 */
export const EVENTS = {
    // Аутентификация
    USER_LOGGED_IN: 'user:logged-in',
    USER_LOGGED_OUT: 'user:logged-out',
    USER_REGISTERED: 'user:registered',
    SESSION_RESTORED: 'session:restored',

    // Идеи
    IDEAS_LOADED: 'ideas:loaded',
    IDEA_CREATED: 'idea:created',
    IDEA_UPDATED: 'idea:updated',
    IDEA_DELETED: 'idea:deleted',
    IDEA_REACTION_TOGGLED: 'idea:reaction-toggled',

    // Посты
    POSTS_LOADED: 'posts:loaded',
    POST_CREATED: 'post:created',

    // Профиль
    PROFILE_UPDATED: 'profile:updated',

    // Настройки
    THEME_CHANGED: 'theme:changed',

    // Песочница
    SANDBOX_SAVED: 'sandbox:saved',
    SANDBOX_RESTORED: 'sandbox:restored',

    // UI
    NAVIGATION_CHANGED: 'navigation:changed',
    MODAL_OPENED: 'modal:opened',
    MODAL_CLOSED: 'modal:closed',

    // Системные
    ERROR_OCCURRED: 'error:occurred',
};