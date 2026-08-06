/**
 * Песочница с историей кода.
 * Хранит последние 10 версий для каждой идеи.
 */
import { storageAdapter } from '../../infrastructure/storage/storage.adapter.js';
import { eventBus } from '../../core/event-bus/event-bus.js';
import { EVENTS } from '../../core/event-bus/event-types.js';
import { logger } from '../../core/utils/logger.js';

class SandboxService {
    constructor() {
        this.historyKey = 'sandbox-history';
        this.maxHistory = 10;
    }

    getHistory(ideaId) {
        const allHistory = storageAdapter.get(this.historyKey) || {};
        return allHistory[ideaId] || [];
    }

    saveVersion(ideaId, html, css, js) {
        try {
            const allHistory = storageAdapter.get(this.historyKey) || {};

            if (!allHistory[ideaId]) {
                allHistory[ideaId] = [];
            }

            allHistory[ideaId].unshift({
                timestamp: Date.now(),
                html,
                css,
                js
            });

            // Ограничиваем историю
            if (allHistory[ideaId].length > this.maxHistory) {
                allHistory[ideaId] = allHistory[ideaId].slice(0, this.maxHistory);
            }

            storageAdapter.set(this.historyKey, allHistory);
            eventBus.emit(EVENTS.SANDBOX_SAVED, { ideaId, version: allHistory[ideaId][0] });
            logger.info('[SandboxService] Версия сохранена', { ideaId });
        } catch (error) {
            logger.error('[SandboxService] Ошибка сохранения:', error);
        }
    }

    restoreVersion(ideaId, index) {
        try {
            const history = this.getHistory(ideaId);
            if (!history[index]) {
                throw new Error(`Версия с индексом ${index} не найдена`);
            }

            const version = history[index];
            eventBus.emit(EVENTS.SANDBOX_RESTORED, { ideaId, version });
            logger.info('[SandboxService] Версия восстановлена', { ideaId, index });

            return version;
        } catch (error) {
            logger.error('[SandboxService] Ошибка восстановления:', error);
            return null;
        }
    }

    clearHistory(ideaId) {
        try {
            const allHistory = storageAdapter.get(this.historyKey) || {};
            delete allHistory[ideaId];
            storageAdapter.set(this.historyKey, allHistory);
            logger.info('[SandboxService] История очищена', { ideaId });
        } catch (error) {
            logger.error('[SandboxService] Ошибка очистки:', error);
        }
    }
}

export const sandboxService = new SandboxService();