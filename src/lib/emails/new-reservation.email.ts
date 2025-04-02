import { MAILER } from '$env/static/private';
import { Resend } from 'resend';

const resend = new Resend(MAILER);

export async function newReservationEmail(name: string, email: string, confirmLink: string) {
	return await resend.emails.send({
		from: 'Emiliano Lo Russo <reservations@mailer.emihairclub.com>',
		to: [email],
		subject: 'Grazie per la prenotazione!',
		html: `Ciao ${name}, <br/>
		per confermare la prenotazione clicca questo link <a href=${confirmLink}>conferma</a>
		`
	});
}

export async function newUser(name: string, email: string, confirmLink: string) {
	return await resend.emails.send({
		from: 'Emiliano Lo Russo <account@mailer.emihairclub.com>',
		to: [email],
		subject: 'Conferma il tuo account!',
		html: `Ciao ${name}, <br/>
		per verificare il tuo account clicca questo link <a href=${confirmLink}>verifica</a>
		`
	});
}
