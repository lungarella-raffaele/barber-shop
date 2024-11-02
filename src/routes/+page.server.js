/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('book-name');
		const email = formData.get('book-email');
		const date = formData.get('book-date');
		console.log('name ' + name + ' email ' + email + ' date ' + date);
	}
};
