export type Result<T> = { ok: true; value: T } | { ok: false; error: Error };
type Error = 'conflict' | 'db_error' | 'invalid_input';
