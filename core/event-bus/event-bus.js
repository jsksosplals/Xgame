/**
 * Событийная шина (Pub/Sub) — связь между модулями без прямых зависимостей.
 * Любая часть приложения может подписаться на событие или вызвать его.
 */
class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    subscribe(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
        return () => this.unsubscribe(event, callback);
    }

    unsubscribe(event, callback) {
        if (this.listeners.has(event)) {
            const filtered = this.listeners.get(event).filter(cb => cb !== callback);
            this.listeners.set(event, filtered);
        }
    }

    emit(event, payload) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(cb => {
                try {
                    cb(payload);
                } catch (error) {
                    console.error(`[EventBus] Ошибка в обработчике ${event}:`, error);
                }
            });
        }
    }
}

export const eventBus = new EventBus();