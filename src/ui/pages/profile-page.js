// src/ui/pages/profile-page.js
export function renderProfilePage() {
    const app = document.getElementById('app');
    const content = document.createElement('div');
    content.id = 'page-content';
    
    content.innerHTML = `
        <div class="page-block" id="page-user-profile" style="text-align:center; max-width: 480px; margin: 0 auto; padding: 24px 0;">
            <!-- КНОПКА НАЗАД -->
            <div class="back-btn-circle" id="btn-back-from-profile" style="position: sticky; top: 0; margin-bottom: 8px; cursor: pointer;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </div>

            <!-- АВАТАР -->
            <div class="avatar-xl" style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #db2777); margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 44px; color: white; box-shadow: 0 12px 40px rgba(124, 58, 237, 0.25); border: 2px solid rgba(255,255,255,0.08);">
                👤
            </div>

            <!-- ИМЯ И ТЕГ -->
            <div class="name-text" style="font-size: 22px; font-weight: 700;">god</div>
            <div class="tag-text" style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">@god</div>

            <!-- ИНФОРМАЦИОННАЯ КАРТОЧКА -->
            <div class="info-card-prof" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 20px; padding: 16px; text-align: left; margin-bottom: 16px;">
                <div class="info-row-prof" style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
                    <div class="info-label-prof" style="color: var(--text-secondary); font-size: 14px;">Username</div>
                    <div class="info-val-prof" style="color: var(--text-primary); font-weight: 500;">@god</div>
                </div>
                <div class="info-row-prof" style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
                    <div class="info-label-prof" style="color: var(--text-secondary); font-size: 14px;">Никнейм</div>
                    <div class="info-val-prof" style="color: var(--text-primary); font-weight: 500;">god</div>
                </div>
                <div class="info-row-prof" style="display: flex; justify-content: space-between; padding: 8px 0;">
                    <div class="info-label-prof" style="color: var(--text-secondary); font-size: 14px;">Описание</div>
                    <div class="info-val-prof" style="color: #888;">—</div>
                </div>
            </div>

            <!-- СЕГМЕНТИРОВАННОЕ МЕНЮ (вкладки) -->
            <div class="segmented-prof" style="display: flex; gap: 6px; background: rgba(255,255,255,0.04); padding: 4px; border-radius: 60px; margin-bottom: 16px;">
                <button class="active" id="seg-ideas" style="flex: 1; padding: 8px 0; border: none; border-radius: 60px; background: linear-gradient(135deg, #7c3aed, #db2777); color: white; font-weight: 600; cursor: pointer;">Идеи <span style="font-weight: 400;">(12)</span></button>
                <button id="seg-posts" style="flex: 1; padding: 8px 0; border: none; border-radius: 60px; background: transparent; color: var(--text-secondary); font-weight: 500; cursor: pointer;">Посты <span style="font-weight: 400;">(5)</span></button>
            </div>

            <!-- КОНТЕЙНЕР ДЛЯ ЛЕНТЫ -->
            <div id="profile-feed-container" style="text-align: left; min-height: 200px;">
                <div class="glass" style="padding: 32px; text-align: center; color: var(--text-secondary);">
                    <span style="font-size: 24px; display: block; margin-bottom: 8px;">💡</span>
                    Здесь будут идеи пользователя.
                </div>
            </div>
        </div>
    `;
    
    // Удаляем старую страницу
    const oldContent = document.getElementById('page-content');
    if (oldContent) oldContent.remove();
    
    app.appendChild(content);

    // ===== ОБРАБОТЧИК КНОПКИ НАЗАД =====
    document.getElementById('btn-back-from-profile')?.addEventListener('click', () => {
        window.history.back();
    });

    // ===== ОБРАБОТЧИК ВКЛАДОК =====
    const segIdeas = document.getElementById('seg-ideas');
    const segPosts = document.getElementById('seg-posts');
    const feedContainer = document.getElementById('profile-feed-container');

    segIdeas?.addEventListener('click', () => {
        segIdeas.className = 'active';
        segIdeas.style.background = 'linear-gradient(135deg, #7c3aed, #db2777)';
        segIdeas.style.color = 'white';
        segPosts.className = '';
        segPosts.style.background = 'transparent';
        segPosts.style.color = 'var(--text-secondary)';
        feedContainer.innerHTML = `<div class="glass" style="padding: 32px; text-align: center; color: var(--text-secondary);"><span style="font-size: 24px; display: block; margin-bottom: 8px;">💡</span>Здесь будут идеи пользователя.</div>`;
    });

    segPosts?.addEventListener('click', () => {
        segPosts.className = 'active';
        segPosts.style.background = 'linear-gradient(135deg, #7c3aed, #db2777)';
        segPosts.style.color = 'white';
        segIdeas.className = '';
        segIdeas.style.background = 'transparent';
        segIdeas.style.color = 'var(--text-secondary)';
        feedContainer.innerHTML = `<div class="glass" style="padding: 32px; text-align: center; color: var(--text-secondary);"><span style="font-size: 24px; display: block; margin-bottom: 8px;">📰</span>Здесь будут посты пользователя.</div>`;
    });
}