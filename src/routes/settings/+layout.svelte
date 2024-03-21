<script>
	/** @type {import('./$types').PageData} */
	export let data;
	import TopBar from '$components/TopBar.svelte';
	import { onMount, setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { page, navigating } from '$app/stores';
	import { Modals, closeModal } from 'svelte-modals';
	import cookie from 'cookie';
	import ms from 'ms';
	import { openModal } from 'svelte-modals';
	import WelcomeModal from '$components/WelcomeModal.svelte';

	const { client, user } = data;
	setContext('user', user);
	let mounted = false;
	let cookies = {};
	let theme = data.theme;
	onMount(() => {
		if (theme === undefined) {
			theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			document.cookie = cookie.serialize('theme', theme, {
				maxAge: ms('1y') / 1000,
				path: '/',
				sameSite: 'lax'
			});
		}
		cookies = cookie.parse(document.cookie || '');
		if (!cookies.welcomed) openModal(WelcomeModal, { client });
		mounted = true;
	});

	const dismissCookies = () => {
		document.cookie = cookie.serialize('dismissedCookies', 'true', {
			maxAge: ms('1y') / 1000,
			path: '/',
			sameSite: 'lax'
		});
		cookies.dismissedCookies = true;
	};

	const links = [
		{
			icon: 'fa-solid fa-book',
			name: 'Documentation',
			url: 'https://discordtickets.app'
		},
		{
			icon: 'fab fa-discord',
			name: 'Support',
			url: 'https://lnk.earth/discord'
		},
		{
			icon: 'fa-solid fa-comments',
			name: 'Feedback',
			url: 'https://lnk.earth/dsctickets-feedback'
		}
	];
</script>

<svelte:head>
	<title>Discord Tickets</title>
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<div class={theme}>
	<div class="bg-gray-200 dark:bg-slate-900 min-h-screen h-max w-full absolute">
		<Modals>
			<div slot="backdrop" class="backdrop" transition:fade on:click={closeModal} />
			<div slot="loading">
				<div class="spinner">
					<div class="cube1" />
					<div class="cube2" />
				</div>
			</div>
		</Modals>
		{#if mounted && client.public && !cookies.dismissedCookies}
			<div
				class="bg-blurple text-white font-medium m-0 p-1 sm:px-8 flex flex-row justify-center gap-8 w-full"
			>
				<p>Cookies are being used to store credentials and preferences.</p>
				<p>
					<i
						class="fa-sharp fa-solid fa-circle-xmark justify-self-end hover:cursor-pointer"
						title="Dismiss"
						on:click={dismissCookies}
					/>
				</p>
			</div>
		{/if}
		<div class="m-2 sm:m-6 lg:m-12 ">
			<div class="max-w-7xl mx-auto">
				<div class="text-gray-800 dark:text-slate-300">
					{#if $navigating || !mounted}
						<div class="spinner">
							<div class="cube1" />
							<div class="cube2" />
						</div>
					{:else}
						<TopBar {user} isDark={theme === 'dark'} />
						<slot />
						<footer class="text-center my-16">
							<div class="text-sm p-2 mb-6">
								<a
									href="/"
									class="text-gray-500 dark:text-slate-400 hover:text-blurple dark:hover:text-blurple cursor-pointer transition duration-300"
								>
									<i class="fa-solid fa-arrow-left" />
									De vuelta al portal
								</a>
							</div>
	
							<p>
								<a
									target="_blank"
									rel="noopener noreferrer"
									class="hover:text-blurple dark:hover:text-blurple cursor-pointer transition duration-300"
									>Tickets Dashboard</a
								>
								by
								<a
									target="_blank"
									rel="noopener noreferrer"
									class="hover:text-blurple dark:hover:text-blurple cursor-pointer transition duration-300"
									>Ratrexxx</a
								>
							</p>
							<p>
								<i class="fa-solid fa-copyright" />
								{new Date().getFullYear()}
								<a
									target="_blank"
									class="hover:text-blurple dark:hover:text-blurple cursor-pointer transition duration-300"
									>Ratrexxx</a
								>
							</p>
							<!-- <p class="my-4">
								<a
									class="hover:text-blurple text-lg transition duration-300"
								>
									<i class="fab fa-discord" />
								</a>
							</p> -->

						</footer>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
