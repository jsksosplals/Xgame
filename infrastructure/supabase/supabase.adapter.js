/**
 * Адаптер для работы с Supabase.
 * Если захочешь сменить БД — перепишешь только этот файл.
 */
import { supabaseClient } from './supabase.client.js';

class SupabaseAdapter {
    // ===== AUTH =====
    get auth() {
        return supabaseClient.auth;
    }

    // ===== QUERIES =====
    async query(table, params = {}) {
        let query = supabaseClient.from(table);

        if (params.select) {
            query = query.select(params.select);
        }

        if (params.where) {
            const { field, value } = params.where;
            query = query.eq(field, value);
        }

        if (params.order) {
            const { field, ascending = false } = params.order;
            query = query.order(field, { ascending });
        }

        if (params.range) {
            const { from, to } = params.range;
            query = query.range(from, to);
        }

        if (params.limit) {
            query = query.limit(params.limit);
        }

        const { data, error } = await query;
        if (error) throw new Error(`Supabase query error: ${error.message}`);
        return data;
    }

    async insert(table, payload) {
        const { data, error } = await supabaseClient.from(table).insert(payload).select();
        if (error) throw new Error(`Supabase insert error: ${error.message}`);
        return data[0];
    }

    async update(table, id, payload) {
        const { data, error } = await supabaseClient.from(table).update(payload).eq('id', id).select();
        if (error) throw new Error(`Supabase update error: ${error.message}`);
        return data[0];
    }

    async delete(table, id) {
        const { error } = await supabaseClient.from(table).delete().eq('id', id);
        if (error) throw new Error(`Supabase delete error: ${error.message}`);
        return true;
    }

    // ===== STORAGE =====
    get storage() {
        return supabaseClient.storage;
    }

    async uploadFile(bucket, path, file) {
        const { data, error } = await supabaseClient.storage.from(bucket).upload(path, file);
        if (error) throw new Error(`Upload error: ${error.message}`);
        const { data: { publicUrl } } = supabaseClient.storage.from(bucket).getPublicUrl(path);
        return publicUrl;
    }
}

export const supabaseAdapter = new SupabaseAdapter();