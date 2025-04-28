import { MAILER } from '$env/static/private';
import { BARBER_SHOP_DETAILS } from '$lib/constants';
import { Resend } from 'resend';

const resend = new Resend(MAILER);

export async function verifyEmail(name: string, email: string, link: string) {
	return await resend.emails.send({
		from: 'Emi Hair Club <users@mailer.emihairclub.com>',
		to: [email],
		subject: 'Verifica email',
		html: `
		<!doctype html>
		<html lang="it">
		<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Verifica Email</title>
		<style>
		body {
		font-family: 'Helvetica Neue', Arial, sans-serif;
		line-height: 1.6;
		color: #333333;
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
		}

		.email-container {
		border: 1px solid #e1e1e1;
		border-radius: 5px;
		overflow: hidden;
		}

		.content {
		padding: 30px;
		background-color: #ffffff;
		}

		.footer {
		background-color: #f5f5f5;
		padding: 15px;
		text-align: center;
		font-size: 12px;
		color: #666666;
		}

		h1 {
		margin: 0;
		font-size: 24px;
		}

		p {
		margin-bottom: 15px;
		}

		.salon-info {
		margin-top: 30px;
		padding-top: 15px;
		border-top: 1px solid #e1e1e1;
		font-size: 14px;
		}

		hr {
		display: block;
		height: 1px;
		border: 0;
		border-top: 1px solid #ccc;
		margin: 1em 0;
		padding: 0;
		}

		.detail-box {
		background-color: #f9fafb;
		border-radius: 20px;
		padding: 2rem;
		}

		.detail-title {
		margin: 0px;
		}

		.confirm-button {
		display: inline-block;
		margin-top: 30px;
		padding: 15px 25px;
		border-radius: 15px;
		background-color: #17a34a;
		color: white;
		text-decoration: none;
		font-weight: bold;
		text-align: center;
		}

		.confirm-wrapper {
		text-align: center;
		}
		</style>
		</head>
		<body>
		<div class="email-container">
		<div class="content">
		<h1>Emi Hair Club</h1>
		<p>Verifica email</p>
		<hr />

		<p>Ciao <strong>${name}</strong>,</p>
		<p>Per confermare la tua utenza clicca il pulsante in basso.</p>

		<div class="confirm-wrapper">
		<a class="confirm-button" href="${link}">Verifica email</a>
		</div>

		<div class="salon-info">
		<p>
		<strong>Emi Hair Club</strong><br />
		${BARBER_SHOP_DETAILS.street}<br />
		${BARBER_SHOP_DETAILS.phone}
		</p>
		</div>
		</div>
		<div class="footer">
		<p>${new Date().getFullYear()} Emi Hair Club</p>
		</div>
		</div>
		</body>
		</html>
		`
	});
}
