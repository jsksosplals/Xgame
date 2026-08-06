/**
 * ================================================================
 *  router.js — МАРШРУТИЗАТОР (SPA)
 *  ===============================================================
 *  - Переключение между страницами без перезагрузки
 *  - Обработка истории браузера (назад/вперёд)
 *  - Поддержка событий навигации
 * ================================================================
 */

import { eventBus } from '../../core/event-bus/event-bus.js';
import { EVENTS } from '../../core/event-bus/event-types.js';
import { logger } from '../../core/utils/logger.js';

export const router = {
    routes: new Map(),
    defaultRoute: null,
    currentRoute: null,
    _isInitialized: false,

    /**
     * Добавляет маршрут
     * @param {string} path — URL-путь (например, '/ideas')
     * @param {Function} handler — функция, которая рендерит страницу
     * @returns {object} — this (для цепочки вызовов)
     */
    addRoute(path, handler) {
        this.routes.set(path, handler);
        return this;
    },

    /**
     * Устанавливает маршрут по умолчанию
     * @param {string} path — путь по умолчанию
     * @returns {object} — this
     */
    setDefault(path) {
        this.defaultRoute = path;
        return this;
    },

    /**
     * Инициализирует роутер: вешает обработчики событий
     */
    init() {
        if (this._isInitialized) {
            logger.warn('[Router] Уже инициализирован');
            return;
        }

        // Обработка навигации через кнопки "назад/вперёд"
        window.addEventListener('popstate', (event) => {
            const path = window.location.pathname;
            logger.debug('[Router] popstate:', path);
            this.navigate(path, false);
        });

        // Обработка кликов по ссылкам с data-route
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-route]');
            if (link) {
                e.preventDefault();
                const path = link.dataset.route;
                this.navigate(path);
            }
        });

        // Стартуем с текущего пути
        const initialPath = window.location.pathname;
        if (this.routes.has(initialPath)) {
            this.navigate(initialPath, false);
        } else if (this.defaultRoute) {
            this.navigate(this.defaultRoute, false);
        } else {
            logger.error('[Router] Нет ни одного маршрута');
        }

        this._isInitialized = true;
        logger.info('[Router] Инициализация завершена');
    },

    /**
     * Переход на указанный путь
     * @param {string} path — путь (например, '/profile')
     * @param {boolean} pushState — добавлять запись в историю?
     */
    navigate(path, pushState = true) {
        // Нормализуем путь
        const normalizedPath = path.startsWith('/') ? path : '/' + path;

        // Проверяем, есть ли такой маршрут
        if (this.routes.has(normalizedPath)) {
            if (pushState) {
                window.history.pushState({}, '', normalizedPath);
            }

            // Рендерим страницу
            const handler = this.routes.get(normalizedPath);
            try {
                handler();
                this.currentRoute = normalizedPath;
                eventBus.emit(EVENTS.NAVIGATION_CHANGED, normalizedPath);
                logger.debug('[Router] Переход на:', normalizedPath);
            } catch (error) {
                logger.error('[Router] Ошибка рендеринга:', error);
                eventBus.emit(EVENTS.ERROR_OCCURRED, { source: 'router:render', error });
            }
        } else {
            logger.warn('[Router] Маршрут не найден:', normalizedPath);
            // Перенаправляем на дефолтный, если есть
            if (this.defaultRoute && normalizedPath !== this.defaultRoute) {
                this.navigate(this.defaultRoute, pushState);
            } else {
                // Показываем 404
                this._showNotFound(normalizedPath);
            }
        }
    },

    /**
     * Показывает страницу 404
     * @param {string} path — путь, который не найден
     */
    _showNotFound(path) {
        const app = document.getElementById('app');
        const content = document.createElement('div');
        content.id = 'page-content';
        content.innerHTML = `
            <div class="error-state glass" style="padding:60px 40px;text-align:center;max-width:600px;margin:40px auto;">
                <span style="font-size:64px;display:block;margin-bottom:16px;">🔍</span>
                <h2 style="margin-bottom:8px;">Страница не найдена</h2>
                <p style="color:var(--text-secondary);margin-bottom:20px;">
                    Путь <code style="background:rgba(255,255,255,0.06);padding:4px 10px;border-radius:8px;">${path}</code> не существует
                </p>
                <button class="btn" data-route="${this.defaultRoute || '/'}">Вернуться на главную</button>
            </div>
        `;

        const oldContent = document.getElementById('page-content');
        if (oldContent) oldContent.remove();
        app.appendChild(content);

        // Обработчик кнопки "Вернуться"
        content.querySelector('[data-route]')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigate(e.target.dataset.route);
        });
    },

    /**
     * Возвращает текущий путь
     * @returns {string}
     */
    getCurrentRoute() {
        return this.currentRoute;
    },

    /**
     * Проверяет, существует ли маршрут
     * @param {string} path
     * @returns {boolean}
     */
    hasRoute(path) {
        return this.routes.has(path);
    },

    /**
     * Очищает роутер (для тестов)
     */
    clear() {
        this.routes.clear();
        this.currentRoute = null;
        this.defaultRoute = null;
        this._isInitialized = false;
    }
};