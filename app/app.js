/**
 * Главный файл приложения — сборка всех модулей.
 */
import { diContainer } from '../core/di/container.js';
import { store } from '../core/state-manager/state-manager.js';
import { eventBus } from '../core/event-bus/event-bus.js';
import { authService } from '../domain/auth/auth.service.js';
import { ideasService } from '../domain/ideas/ideas.service.js';
import { postsService } from '../domain/posts/posts.service.js';
import { profileService } from '../domain/profile/profile.service.js';
import { sandboxService } from '../domain/sandbox/sandbox.service.js';
import { settingsService } from '../domain/settings/settings.service.js';
import { themeManager } from '../ui/theme/theme-manager.js';
import { router } from '../ui/router/router.js';
import { renderNavbar } from '../ui/components/navbar/navbar.js';
import { renderIdeasPage } from '../ui/pages/ideas-page.js';
import { renderPostsPage } from '../ui/pages/posts-page.js';
import { renderAboutPage } from '../ui/pages/about-page.js';
import { logger } from '../core/utils/logger.js';

// =================================================================
// 1. РЕГИСТРАЦИЯ ЗАВИСИМОСТЕЙ
// =================================================================
diContainer
    .register('authService', authService)
    .register('ideasService', ideasService)
    .register('postsService', postsService)
    .register('profileService', profileService)
    .register('sandboxService', sandboxService)
    .register('settingsService', settingsService)
    .register('store', store)
    .register('eventBus', eventBus)
    .register('themeManager', themeManager)
    .register('router', router);

// =================================================================
// 2. НАСТРОЙКА РОУТИНГА
// =================================================================
router
    .addRoute('/ideas', renderIdeasPage)
    .addRoute('/posts', renderPostsPage)
    .addRoute('/about', renderAboutPage)
    .addRoute('/profile', () => { /* обрабатываем через модалку */ })
    .setDefault('/ideas');

// =================================================================
// 3. ПОДПИСКА НА СОБЫТИЯ
// =================================================================
eventBus.subscribe('navigation:changed', (page) => {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });
});

eventBus.subscribe('user:logged-in', (user) => {
    document.getElementById('avatarText').textContent = user?.user_metadata?.nickname?.charAt(0) || 'U';
    document.getElementById('authBlock').classList.add('hidden');
    document.getElementById('profileBlock').classList.remove('hidden');
});

eventBus.subscribe('user:logged-out', () => {
    document.getElementById('authBlock').classList.remove('hidden');
    document.getElementById('profileBlock').classList.add('hidden');
});

// =================================================================
// 4. ИНИЦИАЛИЗАЦИЯ
// =================================================================
export async function initApp() {
    try {
        logger.info('[App] Инициализация...');

        // Восстанавливаем сессию
        const user = await authService.restoreSession();

        // Применяем тему
        themeManager.applyTheme();

        // Рендерим навбар
        renderNavbar();

        // Загружаем данные
        await Promise.all([
            ideasService.loadIdeas(),
            postsService.loadPosts(),
            user ? profileService.loadProfile(user.id) : Promise.resolve()
        ]);

        // Запускаем роутер
        router.init();

        logger.info('[App] Инициализация завершена');
    } catch (error) {
        logger.error('[App] Ошибка инициализации:', error);
        document.getElementById('content').innerHTML = `
            <div class="error-state glass" style="padding:40px;text-align:center;margin:40px 20px;">
                <h2>⚠️ Ошибка загрузки</h2>
                <p style="color:var(--text-secondary);">${error.message || 'Неизвестная ошибка'}</p>
                <button class="btn" onclick="location.reload()">Обновить</button>
            </div>
        `;
    }
}