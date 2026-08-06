/**
 * Простой контейнер для внедрения зависимостей.
 * Регистрируем сервисы — получаем их в любом месте.
 */
class DIContainer {
    constructor() {
        this.services = new Map();
        this.instances = new Map();
    }

    register(name, service) {
        this.services.set(name, service);
        return this;
    }

    get(name) {
        if (!this.services.has(name)) {
            throw new Error(`[DI] Сервис "${name}" не зарегистрирован`);
        }

        // Если уже создан экземпляр — возвращаем его
        if (this.instances.has(name)) {
            return this.instances.get(name);
        }

        // Иначе создаём
        const ServiceClass = this.services.get(name);
        const instance = new ServiceClass();
        this.instances.set(name, instance);
        return instance;
    }

    clear() {
        this.services.clear();
        this.instances.clear();
    }
}

export const diContainer = new DIContainer();