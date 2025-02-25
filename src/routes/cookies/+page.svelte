<script>
	import { BARBER_SHOP_DETAILS } from '$lib/constants';
</script>

<div class="cookie-policy-container">
	<h1>Cookie Policy</h1>

	<section>
		<h2>Informazioni sui Cookie</h2>
		<p>
			I cookie sono piccoli file di testo che i siti visitati dagli utenti inviano ai loro
			dispositivi, dove vengono memorizzati per essere ritrasmessi agli stessi siti in
			occasione di visite successive. I cookie sono utilizzati per diverse finalità, hanno
			caratteristiche diverse e possono essere utilizzati sia dal titolare del sito che si sta
			visitando, sia da terze parti.
		</p>
	</section>

	<section>
		<h2>Cookie utilizzati da questo sito</h2>
		<p>
			Questo sito web utilizza esclusivamente cookie tecnici essenziali per il suo
			funzionamento. Non vengono utilizzati cookie di profilazione, marketing o analitici.
		</p>
	</section>

	<section>
		<h3>Cookie tecnici essenziali</h3>
		<p>
			Questi cookie sono strettamente necessari per il funzionamento del sito. Senza l'uso di
			tali cookie, alcune parti del nostro sito non funzionerebbero correttamente. Comprendono
			cookie che consentono di ricordare l'utente durante la navigazione del sito in una
			singola sessione o, se richiesto, da una sessione all'altra.
		</p>

		<div class="cookie-details">
			<h4 class="mb-2 text-lg font-bold">Dettagli dei cookie tecnici utilizzati:</h4>
			<ul>
				<li><strong>Finalità</strong>: Autenticazione e gestione della sessione utente</li>
				<li><strong>Durata</strong>: 30 giorni</li>
				<li>
					<strong>Nome dei cookie</strong>: "auth-session"
				</li>
				<li>
					<strong>Dati raccolti</strong>: Informazioni di sessione necessarie per
					identificare e autenticare l'utente
				</li>
			</ul>
		</div>
	</section>

	<section>
		<h2>Disabilitazione dei cookie tramite il browser</h2>
		<p>
			La maggior parte dei browser permette di cancellare i cookie dal disco fisso del
			computer, di bloccare l'accettazione dei cookie o di ricevere un avviso prima che un
			cookie venga memorizzato. Tuttavia, se l'utente blocca o cancella i cookie tecnici
			utilizzati da questo sito, il funzionamento del sito potrebbe risultare compromesso e
			potrebbe non essere possibile accedere a certe aree o utilizzare alcuni dei servizi
			offerti.
		</p>

		<div class="browser-instructions">
			<h4 class="mb-2 text-lg font-bold">Come gestire i cookie nei principali browser:</h4>
			<ul>
				<li>
					<strong>Chrome</strong>: Menu → Impostazioni → Mostra impostazioni avanzate →
					Privacy → Impostazioni contenuti → Cookie
				</li>
				<li>
					<strong>Firefox</strong>: Menu → Opzioni → Privacy → Utilizzare impostazioni
					personalizzate → Cookie
				</li>
				<li>
					<strong>Internet Explorer</strong>: Menu → Opzioni Internet → Privacy → Avanzate
				</li>
				<li><strong>Safari</strong>: Preferenze → Privacy</li>
				<li>
					<strong>Edge</strong>: Impostazioni e altro → Impostazioni → Autorizzazioni sito
					→ Cookie e dati del sito
				</li>
			</ul>
		</div>
	</section>

	<section>
		<h2>Modifiche alla Cookie Policy</h2>
		<p>
			La presente Cookie Policy può subire modifiche nel tempo. Si consiglia quindi di
			controllare regolarmente questa pagina e di fare riferimento alla data dell'ultimo
			aggiornamento indicata in fondo.
		</p>
	</section>

	<section>
		<h2>Contatti</h2>
		<p>
			Per qualsiasi informazione riguardante la presente Cookie Policy è possibile contattare
			il titolare del trattamento all'indirizzo email: {BARBER_SHOP_DETAILS.email}
		</p>
	</section>

	<footer>
		<p>Data ultimo aggiornamento: Martedì 25 Febbraio 2025</p>
	</footer>
</div>

<style>
	h1 {
		font-weight: bold;
	}

	h2,
	h3 {
		margin-top: 1.5em;
		margin-bottom: 0.5em;
		font-weight: bold;
	}

	h1 {
		font-size: 2em;
		border-bottom: 1px solid #ddd;
		padding-bottom: 0.5em;
	}

	h2 {
		font-size: 1.5em;
	}

	h3 {
		font-size: 1.2em;
	}

	p {
		margin-bottom: 1em;
	}

	section {
		margin-bottom: 2em;
	}

	ul {
		margin-bottom: 1em;
	}

	li {
		margin-bottom: 0.5em;
	}

	footer {
		margin-top: 2em;
		padding-top: 1em;
		border-top: 1px solid #ddd;
		font-size: 0.9em;
		color: #666;
	}

	strong {
		font-weight: bold;
	}
</style>
