import { MAILER } from '$env/static/private';
import { BARBER_SHOP_DETAILS } from '$lib/constants';
import { Resend } from 'resend';

const resend = new Resend(MAILER);

export async function newReservationEmail(name: string, email: string, confirmLink: string) {
	return await resend.emails.send({
		from: 'Emiliano Lo Russo <reservations@mailer.emihairclub.com>',
		to: [email],
		subject: 'Grazie per la prenotazione!',
		html: `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conferma Prenotazione</title>
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
    </style>
</head>
<body>
    <div class="email-container">
        <div class="content">
            <p>Ciao <strong>${name}</strong>,</p>
            <p>Grazie per aver prenotato un appuntamento presso Emi Hair Club!</p>
            <p>Per completare la prenotazione, ti chiediamo gentilmente di confermare cliccando il seguente link:
            	<a href="${confirmLink}">conferma prenotazione</a>
            </p>

            <p>Se non hai effettuato questa prenotazione, puoi ignorare questa email.</p>

            <div class="salon-info">
                <p><strong>Emi Hair Club</strong><br>
                ${BARBER_SHOP_DETAILS.street}<br>
                ${BARBER_SHOP_DETAILS.phone}<br>
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
