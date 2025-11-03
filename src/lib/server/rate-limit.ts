import type { RouteId } from '$app/types';
import { MINUTE_IN_MS } from '$lib/constants';
import { fail } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { logger } from './logger';

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

interface RouteConfig {
	maxRequests: number;
	windowMs: number;
}

/**
 * Sensitive routes
 */
const ROUTE_CONFIGS: Record<string, RouteConfig> = {
	login: {
		maxRequests: 10,
		windowMs: 15 * MINUTE_IN_MS
	},
	signup: {
		maxRequests: 10,
		windowMs: 60 * MINUTE_IN_MS
	},
	reservation: {
		maxRequests: 15,
		windowMs: 10 * MINUTE_IN_MS
	}
};

function getConfig(route: RouteId): RouteConfig | null {
	switch (route) {
		case '/login': {
			return ROUTE_CONFIGS['login'];
		}
		case '/signup': {
			return ROUTE_CONFIGS['signup'];
		}
		case '/newreservation': {
			return ROUTE_CONFIGS['reservation'];
		}
		default:
			return null;
	}
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Lazy cleanup
 */
function cleanupExpiredEntries() {
	const now = Date.now();
	for (const [key, entry] of rateLimitStore.entries()) {
		if (entry.resetAt < now) {
			rateLimitStore.delete(key);
		}
	}
}

let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 10 * MINUTE_IN_MS;

/**
 * Rate limit a request based on route
 *
 * @example
 * const result = rateLimit(event, 'login', email, 'Too many attempts');
 * if (result) return result;
 */
export function rateLimit(options: {
	event: RequestEvent;
	message: string;
	email?: string;
	additionalData?: Record<string, unknown>;
}): ReturnType<typeof fail> | null | undefined {
	const now = Date.now();
	if (now - lastCleanup > CLEANUP_INTERVAL) {
		cleanupExpiredEntries();
		lastCleanup = now;
	}

	const { event, email } = options;

	if (!event.route.id) {
		return;
	}

	const config = getConfig(event.route.id);
	if (!config) {
		throw new Error(`Unknown route ID: ${event.route.id}`);
	}

	const key = email ? email : `${event.route.id}:${event.getClientAddress()}`;

	const entry = rateLimitStore.get(key);

	if (entry && entry.resetAt > now) {
		if (entry.count >= config.maxRequests) {
			logger.error(`Too many requests on ${event.route.id}`);
			return fail(429, {
				message: options.message,
				rateLimited: true,
				...options.additionalData
			});
		}
		entry.count++;
	} else {
		rateLimitStore.set(key, {
			count: 1,
			resetAt: now + config.windowMs
		});
	}

	return null;
}
