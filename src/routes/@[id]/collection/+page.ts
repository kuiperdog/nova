import { redirect } from '@sveltejs/kit';

export function load({params}) {
    throw redirect(302, `/@${params.id}`);
}
