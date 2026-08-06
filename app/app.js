/**
 * ================================================================
 *  app.js — ГЛАВНЫЙ ФАЙЛ СБОРКИ
 *  ===============================================================
 *  - Регистрирует все зависимости
 *  - Настраивает маршруты
 *  - Подписывается на события
 *  - Инициализирует приложение
 * ================================================================
 */

import { diContainer } from '../core/di/container.js';
import { store } from '../core/state-manager/state-manager.js';
import { eventBus } from '../core/event-bus/event-bus.js';
import { EVENTS } from '../core/event-bus/event-types.js';
import { authService } from '../domain/auth/auth.service.js';
import { ideasService } from '../domain/ideas/ideas.service.js';
import { postsService } from '../domain/posts/posts.service.js';
import { profileService } from '../domain/profile/profile.service.js';
import { sandboxService } from '../domain/sandbox/sandbox.service.js';
import { themeManager } from '../ui/theme/theme-manager.js';
import { router } from '../ui/router/router.js';
import { renderNavbar } from '../ui/components/navbar.js';
import { renderIdeasPage } from '../ui/pages/ideas-page.js';
import { renderPostsPage } from '../ui/pages/posts-page.js';
import { renderAboutPage } from '../ui/pages/about-page.js';
import { renderProfilePage } from '../ui/pages/profile-page.js';
import { logger } from '../core/utils/logger.js';

// ================================================================
// 1. РЕГИСТРАЦИЯ ЗАВИСИМОСТЕЙ
// ================================================================
diContainer
    .register('authService', authService)
    .register('ideasService', ideasService)
    .register('postsService', postsService)
    .register('profileService', profileService)
    .register('sandboxService', sandboxService)
    .register('store', store)
    .register('eventBus', eventBus)
    .register('themeManager', themeManager)
    .register('router', router);

// ================================================================
// 2. НАСТРОЙКА МАРШРУТОВ
// ================================================================
router
    .addRoute('/ideas', renderIdeasPage)
    .addRoute('/posts', renderPostsPage)
    .addRoute('/about', renderAboutPage)
    .addRoute('/profile', renderProfilePage)  // <-- СТРАНИЦА ПРОФИЛЯ
    .setDefault('/ideas');

// ================================================================
// 3. ПОДПИСКА НА СОБЫТИЯ
// ================================================================
eventBus.subscribe(EVENTS.NAVIGATION_CHANGED, (page) => {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });
});

eventBus.subscribe(EVENTS.USER_LOGGED_IN, (user) => {
    const avatarText = document.getElementById('avatarText');
    if (avatarText) {
        avatarText.textContent = user?.user_metadata?.nickname?.charAt(0) || 'U';
    }
    const authBlock = document.getElementById('authBlock');
    const profileBlock = document.getElementById('profileBlock');
    if (authBlock) authBlock.classList.add('hidden');
    if (profileBlock) profileBlock.classList.remove('hidden');
    
    // Загружаем профиль пользователя
    profileService.loadProfile(user.id).then(() => {
        logger.info('[App] Профиль загружен');
    });
});

eventBus.subscribe(EVENTS.USER_LOGGED_OUT, () => {
    const authBlock = document.getElementById('authBlock');
    const profileBlock = document.getElementById('profileBlock');
    if (authBlock) authBlock.classList.remove('hidden');
    if (profileBlock) profileBlock.classList.add('hidden');
});

eventBus.subscribe(EVENTS.ERROR_OCCURRED, ({ source, error }) => {
    logger.error(`[App] Ошибка в ${source}:`, error);
    // Можно показать уведомление пользователю
});

// ================================================================
// 4. ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ================================================================
export async function initApp() {
    try {
        logger.info('[App] Инициализация...');

        // Проверяем наличие #app
        const app = document.getElementById('app');
        if (!app) {
            throw new Error('Элемент #app не найден в index.html');
        }

        // Восстанавливаем сессию
        const user = await authService.restoreSession();
        if (user) {
            // Загружаем профиль
            await profileService.loadProfile(user.id);
        }

        // Применяем тему
        themeManager.applyTheme();

        // Рендерим навбар
        renderNavbar();

        // Загружаем данные
        await Promise.all([
            ideasService.loadIdeas(),
            postsService.loadPosts()
        ]);

        // Запускаем роутер
        router.init();

        logger.info('[App] Инициализация завершена успешно');
    } catch (error) {
        logger.error('[App] Критическая ошибка инициализации:', error);
        
        // Показываем ошибку пользователю
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div class="error-state glass" style="padding:40px;text-align:center;margin:40px 20px;">
                    <h2 style="margin-bottom:12px;">⚠️ Ошибка загрузки</h2>
                    <p style="color:var(--text-secondary);margin-bottom:16px;">
                        ${error.message || 'Неизвестная ошибка'}
                    </p>
                    <button class="btn" onclick="location.reload()">🔄 Обновить</button>
                </div>
            `;
        }
    }
}

// ================================================================
// 5. АВТОЗАПУСК
// ================================================================
// Если скрипт загружен как модуль, он запускается автоматически
// при загрузке страницы. Можно оставить как есть.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

export default { initApp };