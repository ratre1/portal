import { error, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const fetchOptions = { credentials: 'include' };
	const response = await fetch(
		`${env.PUBLIC_HOST}/api/admin/guilds/${params.guild}/settings`,
		fetchOptions
	);
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (response.status === 401) {
		throw redirect(307, `${env.PUBLIC_HOST}/auth/login`);
	} else if (!response.ok) {
		throw error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return {
			url: `${env.PUBLIC_HOST}/api/admin/guilds/${params.guild}/settings`,
			settings: body,
			channels: await (
				await fetch(
					`${env.PUBLIC_HOST}/api/admin/guilds/${params.guild}/data?query=channels.cache`,
					fetchOptions
				)
			).json(),
			locales: await (await fetch(`${env.PUBLIC_HOST}/api/locales`, fetchOptions)).json(),
			roles: await (
				await fetch(
					`${env.PUBLIC_HOST}/api/admin/guilds/${params.guild}/data?query=roles.cache`,
					fetchOptions
				)
			).json()
		};
	}
}