import { redirect, type Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import path from 'path';
import fs from 'fs';

const maintenanceMode = true;
const maintenanceHtml = maintenanceMode
	? fs.readFileSync(path.join(process.cwd(), 'static', 'index.html'), 'utf-8')
	: null;

const handleAuth: Handle = async ({ event, resolve }) => {
	if (maintenanceMode && maintenanceHtml) {
		return new Response(maintenanceHtml, {
			status: 503,
			headers: {
				'Content-Type': 'text/html',
				'Retry-After': '3600'
			}
		});
	}
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		if (event.route.id && event.route.id.startsWith('/(protected)')) {
			if (!event.locals.user) {
				redirect(303, '/login');
			}
		}

		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	if (event.route.id && event.route.id.startsWith('/(admin)')) {
		if (!event.locals.user) {
			redirect(303, '/login');
		}
		if (event.locals.user.role !== 'staff') {
			redirect(303, '/');
		}
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle: Handle = handleAuth;
