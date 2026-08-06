/**
 * Выпадающее меню профиля с аватаркой и настройками.
 */
import { authService } from '../../../domain/auth/auth.service.js';
import { themeManager } from '../../theme/theme-manager.js';
import { store } from '../../../core/state-manager/state-manager.js';
import { renderModal } from '../shared/modal.js';
import { renderProfileModal } from './profile-modal.js';
import { renderSettingsModal } from './settings-modal.js';

export function renderProfileDropdown(avatarElement) {
    const user = store.get('user');
    const profile = store.get('profile');

    const dropdown = document.createElement('div');
    dropdown.className = 'profile-dropdown glass';
    dropdown.innerHTML = `
        <div class="profile-dropdown-header">
            <div class="avatar avatar-lg">${avatarElement.innerHTML}</div>
            <div>
                <div class="profile-nick">${profile?.nickname || user?.user_metadata?.nickname || 'Пользователь'}</div>
                <div class="profile-email">${user?.email || ''}</div>
            </div>
        </div>
        <div class="profile-dropdown-divider"></div>
        <button data-action="profile">👤 Мой профиль</button>
        <button data-action="settings">⚙️ Настройки</button>
        <button data-action="theme">🌓 Тема (${themeManager.getCurrentTheme()})</button>
        <div class="profile-dropdown-divider"></div>
        <button data-action="logout" class="text-danger">🚪 Выйти</button>
    `;

    // Обработчики
    dropdown.querySelector('[data-action="profile"]').addEventListener('click', () => {
        renderProfileModal();
        dropdown.remove();
    });

    dropdown.querySelector('[data-action="settings"]').addEventListener('click', () => {
        renderSettingsModal();
        dropdown.remove();
    });

    dropdown.querySelector('[data-action="theme"]').addEventListener('click', () => {
        themeManager.toggleTheme();
        const btn = dropdown.querySelector('[data-action="theme"]');
        btn.textContent = `🌓 Тема (${themeManager.getCurrentTheme()})`;
    });

    dropdown.querySelector('[data-action="logout"]').addEventListener('click', async () => {
        await authService.logout();
        window.location.reload();
    });

    return dropdown;
}