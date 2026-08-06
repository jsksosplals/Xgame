/**
 * ================================================================
 *  navbar.js — НАВИГАЦИОННАЯ ПАНЕЛЬ
 *  ===============================================================
 *  - Логотип
 *  - Ссылки на разделы (Идеи, Посты, О нас)
 *  - Поиск
 *  - Кнопка фильтра (круглая)
 *  - Переключатель темы
 *  - Авторизация (вход/регистрация)
 *  - Аватар пользователя (с переходом в профиль)
 * ================================================================
 */

import { store } from '../../core/state-manager/state-manager.js';
import { authService } from '../../domain/auth/auth.service.js';
import { themeManager } from '../theme/theme-manager.js';
import { router } from '../router/router.js';
import { eventBus } from '../../core/event-bus/event-bus.js';
import { EVENTS } from '../../core/event-bus/event-types.js';
import { logger } from '../../core/utils/logger.js';

/**
 * Рендерит навбар и встраивает его в DOM
 */
export function renderNavbar() {
    const app = document.getElementById('app');
    const user = store.get('user');
    const profile = store.get('profile');

    // Удаляем старый навбар, если есть
    const oldNavbar = document.getElementById('navbar');
    if (oldNavbar) oldNavbar.remove();

    const navbar = document.createElement('nav');
    navbar.id = 'navbar';
    navbar.className = 'glass';
    navbar.innerHTML = `
        <div class="logo">Xgame</div>

        <div class="nav-links">
            <a data-route="/ideas" class="active">Идеи</a>
            <a data-route="/posts">Посты</a>
            <a data-route="/about">О нас</a>
        </div>

        <div class="nav-right">
            <div class="search-wrapper">
                <input type="text" id="searchInput" placeholder="Поиск">
            </div>

            <!-- КРУГЛАЯ КНОПКА ФИЛЬТРА -->
            <button class="filter-circle" id="filterToggleBtn">⚙️</button>

            <!-- ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ -->
            <button id="themeToggle" class="btn btn-outline btn-sm">🌓</button>

            <!-- БЛОК АВТОРИЗАЦИИ -->
            <div id="authBlock">
                <button class="btn btn-sm btn-outline" id="loginBtn">Войти</button>
                <button class="btn btn-sm" id="registerBtn">Регистрация</button>
            </div>

            <!-- БЛОК ПРОФИЛЯ (скрыт по умолчанию) -->
            <div id="profileBlock" class="hidden" style="position:relative;">
                <div class="avatar" id="avatarBtn" title="Профиль">
                    <span id="avatarText">${profile?.nickname?.charAt(0) || user?.user_metadata?.nickname?.charAt(0) || 'U'}</span>
                </div>
            </div>
        </div>
    `;

    // Вставляем навбар в начало #app
    app.prepend(navbar);

    // ================================================================
    //  ОБРАБОТЧИКИ СОБЫТИЙ
    // ================================================================

    // ---- НАВИГАЦИЯ ----
    navbar.querySelectorAll('[data-route]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const route = link.dataset.route;
            router.navigate(route);
            navbar.querySelectorAll('[data-route]').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // ---- ПОИСК ----
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            eventBus.emit(EVENTS.SEARCH_CHANGED, query);
        });
    }

    // ---- ФИЛЬТР (круглая кнопка) ----
    const filterToggle = document.getElementById('filterToggleBtn');
    const filterDropdown = document.getElementById('filterDropdown');
    if (filterToggle && filterDropdown) {
        filterToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            filterDropdown.classList.toggle('hidden');
        });

        // Закрываем при клике вне
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#filterToggleBtn') && !e.target.closest('#filterDropdown')) {
                filterDropdown.classList.add('hidden');
            }
        });

        // Обработчики для кнопок фильтра
        filterDropdown.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                filterDropdown.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                eventBus.emit(EVENTS.FILTER_CHANGED, btn.dataset.sort);
                filterDropdown.classList.add('hidden');
            });
        });
    }

    // ---- ТЕМА ----
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeManager.toggleTheme();
            // Обновляем текст кнопки
            themeToggle.textContent = document.body.classList.contains('light') ? '☀️' : '🌓';
        });
    }

    // ---- АВТОРИЗАЦИЯ ----
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            eventBus.emit(EVENTS.AUTH_SHOW_LOGIN);
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            eventBus.emit(EVENTS.AUTH_SHOW_REGISTER);
        });
    }

    // ---- ПРОФИЛЬ (клик на аватар) ----
    const avatarBtn = document.getElementById('avatarBtn');
    if (avatarBtn) {
        avatarBtn.addEventListener('click', () => {
            // Закрываем дропдаун, если он открыт
            const dropdown = document.querySelector('.profile-dropdown');
            if (dropdown) dropdown.remove();
            
            // Переходим на страницу профиля
            router.navigate('/profile');
        });
    }

    // ---- ОБНОВЛЕНИЕ СОСТОЯНИЯ ПРИ ИЗМЕНЕНИИ ПОЛЬЗОВАТЕЛЯ ----
    const unsubscribe = store.subscribe((newState) => {
        const user = newState.user;
        const profile = newState.profile;
        const authBlock = document.getElementById('authBlock');
        const profileBlock = document.getElementById('profileBlock');
        const avatarText = document.getElementById('avatarText');

        if (user) {
            if (authBlock) authBlock.classList.add('hidden');
            if (profileBlock) profileBlock.classList.remove('hidden');
            if (avatarText) {
                avatarText.textContent = profile?.nickname?.charAt(0) || user?.user_metadata?.nickname?.charAt(0) || 'U';
            }
        } else {
            if (authBlock) authBlock.classList.remove('hidden');
            if (profileBlock) profileBlock.classList.add('hidden');
        }
    });

    // Сохраняем функцию отписки для очистки
    navbar._unsubscribe = unsubscribe;

    logger.info('[Navbar] Рендеринг завершён');
}