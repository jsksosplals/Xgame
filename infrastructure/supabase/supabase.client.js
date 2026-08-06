/**
 * Инициализация Supabase — единственное место, где есть прямой импорт.
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { APP_CONFIG } from '../../app/app-config.js';

const { url, anonKey } = APP_CONFIG.supabase;

export const supabaseClient = createClient(url, anonKey);

// Проверка подключения
supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) {
        console.error('[Supabase] Ошибка подключения:', error);
    } else {
        console.log('[Supabase] Подключение установлено');
    }
});