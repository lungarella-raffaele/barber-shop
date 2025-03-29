import { MAILER } from '$env/static/private';
import { BARBER_SHOP_DETAILS } from '$lib/constants';
import { Resend } from 'resend';

const resend = new Resend(MAILER);

export async function newReservationEmail(name: string, email: string) {
	const { data, error } = await resend.emails.send({
		from: BARBER_SHOP_DETAILS.mailer_sender,
		to: [email],
		subject: 'Hello World',
		html: '<strong>It works!</strong>'
	});
}
