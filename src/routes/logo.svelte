<div class="total">
	<div class="logo-content p-6 text-center antialiased">
		<h1 class="emi text-shadow flex flex-col items-center antialiased">
			EMI
			<div class="h-[2px] w-3/5 bg-white px-20"></div>
		</h1>
		<h4 class="hair-club text-shadow antialiased">HAIR CLUB</h4>

		<p class="mb-12 text-lg font-bold text-gray-100">
			Il tuo salone di fiducia per tagli di capelli unici e personalizzati.
		</p>
		<div>
			<a
				class="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-xl font-bold text-background transition-all duration-300 hover:scale-105 active:scale-95"
				href="/newreservation"
			>
				<span>Prenota</span>
				<svg
					class="h-6 w-6 transition-transform group-hover:translate-x-1"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</a>
		</div>
	</div>
</div>

<style>
	.total {
		font-size: 0.2rem;
		position: relative;
		background-image: url('/static/hairs.webp');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 0.5rem;
		width: 100%;
		min-height: 500px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
	}

	.total::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		border-radius: 0.5rem;
		z-index: 1;
	}

	.logo-content {
		position: relative;
		z-index: 2;
	}
	.emi {
		font-family: 'Overpass', sans-serif;
		font-weight: normal;
		font-size: 9rem;
		line-height: 1;
		color: white;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	.hair-club {
		font-family: 'Overpass', sans-serif;
		font-weight: normal;
		font-size: 2.5rem;
		margin-top: 20px;
		color: white;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		/* font-optical-sizing: auto;
		font-style: normal; */
	}
</style>
