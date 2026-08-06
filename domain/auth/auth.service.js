/**
 * Сервис аутентификации — вход по email и паролю.
 */
import { supabaseAdapter } from '../../infrastructure/supabase/supabase.adapter.js';
import { store } from '../../core/state-manager/state-manager.js';
import { eventBus } from '../../core/event-bus/event-bus.js';
import { EVENTS } from '../../core/event-bus/event-types.js';
import { logger } from '../../core/utils/logger.js';

class AuthService {
    async login(email, password) {
        try {
            logger.info('[AuthService] Попытка входа', { email });

            const { data, error } = await supabaseAdapter.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw new Error(error.message);

            store.setState({ user: data.user });
            eventBus.emit(EVENTS.USER_LOGGED_IN, data.user);
            logger.info('[AuthService] Вход выполнен', { userId: data.user.id });

            return data.user;
        } catch (error) {
            logger.error('[AuthService] Ошибка входа:', error);
            eventBus.emit(EVENTS.ERROR_OCCURRED, { source: 'auth:login', error });
            throw error;
        }
    }

    async register(email, password, nickname) {
        try {
            logger.info('[AuthService] Регистрация', { email, nickname });

            const { data, error } = await supabaseAdapter.auth.signUp({
                email,
                password,
                options: {
                    data: { nickname }
                }
            });

            if (error) throw new Error(error.message);

            store.setState({ user: data.user });
            eventBus.emit(EVENTS.USER_REGISTERED, data.user);
            logger.info('[AuthService] Регистрация выполнена', { userId: data.user.id });

            return data.user;
        } catch (error) {
            logger.error('[AuthService] Ошибка регистрации:', error);
            eventBus.emit(EVENTS.ERROR_OCCURRED, { source: 'auth:register', error });
            throw error;
        }
    }

    async logout() {
        try {
            await supabaseAdapter.auth.signOut();
            store.setState({ user: null });
            eventBus.emit(EVENTS.USER_LOGGED_OUT);
            logger.info('[AuthService] Выход выполнен');
        } catch (error) {
            logger.error('[AuthService] Ошибка выхода:', error);
            throw error;
        }
    }

    async restoreSession() {
        try {
            const { data: { user } } = await supabaseAdapter.auth.getUser();

            if (user) {
                store.setState({ user });
                eventBus.emit(EVENTS.SESSION_RESTORED, user);
                logger.info('[AuthService] Сессия восстановлена', { userId: user.id });
            }

            return user;
        } catch (error) {
            logger.error('[AuthService] Ошибка восстановления сессии:', error);
            return null;
        }
    }

    getCurrentUser() {
        return store.get('user');
    }

    isAuthenticated() {
        return !!this.getCurrentUser();
    }
}

export const authService = new AuthService();