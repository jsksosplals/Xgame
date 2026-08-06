/**
 * Единый источник истины для всего приложения.
 * Работает как Redux, но без лишнего синтаксиса.
 */
import { eventBus } from '../event-bus/event-bus.js';
import { EVENTS } from '../event-bus/event-types.js';

class StateManager {
    constructor(initialState) {
        this.state = { ...initialState };
        this.middlewares = [];
        this.subscribers = [];
    }

    use(middleware) {
        this.middlewares.push(middleware);
        return this;
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    setState(newState) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...newState };

        // Вызываем middleware
        this.middlewares.forEach(mw => mw(this.state, oldState));

        // Оповещаем подписчиков
        this.subscribers.forEach(cb => cb(this.state, oldState));

        // Генерируем событие
        eventBus.emit(EVENTS.STATE_CHANGED, { state: this.state, oldState });
    }

    getState() {
        return this.state;
    }

    get(key) {
        return this.state[key];
    }

    reset() {
        this.state = {};
        this.subscribers = [];
        this.middlewares = [];
    }
}

// Начальное состояние
const initialState = {
    user: null,
    profile: null,
    ideas: [],
    posts: [],
    currentPage: 'ideas',
    theme: 'dark',
    isLoading: false,
    error: null,
    sandboxHistory: {},
    settings: {
        notifications: true,
        privacy: 'public'
    }
};

export const store = new StateManager(initialState);

// Логируем все изменения состояния (в dev-режиме)
if (process.env.NODE_ENV === 'development') {
    store.use((newState, oldState) => {
        console.log('[StateManager] Изменение:', {
            from: oldState,
            to: newState,
            diff: Object.keys(newState).filter(k => newState[k] !== oldState[k])
        });
    });
}