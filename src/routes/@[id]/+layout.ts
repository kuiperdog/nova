import { isAddress } from 'ethers';
import { __COSMO_API__, __COSMO_PROXY__, __SUBSQUID_API__ } from '$env/static/public';
import { error } from '@sveltejs/kit';
import { Como } from '$lib/utils/model';
import { t, unwrapFunctionStore } from 'svelte-i18n';

const $t = unwrapFunctionStore(t);

export async function load({ params, fetch }) {
    if (isAddress(params.id)) {
        return {
            user: loadUserByAddress(params.id, fetch),
            stats: loadStats(params.id, fetch)
        }
    }

    let user: Cosmo.User;
    try {
        user = await loadUserByNickname(params.id, fetch);
    } catch {
        error(404, $t('profile.not_found'));
    }

    return {
        user: (async () => user)(),
        stats: loadStats(user.address, fetch)
    };
}

async function loadUserByAddress(address: string, fetch: typeof window.fetch): Promise<Cosmo.User> {
    const res = await fetch(`${__COSMO_PROXY__}/user/v1/by-address/${address}`);
    const users = await res.json();
    if (users[0])
        return users[0];

    return { address: address, nickname: '', profileImageUrl: '' };
}

async function loadUserByNickname(nickname: string, fetch: typeof window.fetch): Promise<Cosmo.User> {
    const res = await fetch(`${__COSMO_API__}/user/v1/by-nickname/${nickname}`);
    if (!res.ok)
        throw new Error();

    const data = await res.json();
    return data.profile;
}

async function loadStats(address: string, fetch: typeof window.fetch): Promise<{ balances: Como[], joinDate: Date }> {
    const res = await fetch(__SUBSQUID_API__, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query {
                    comos(orderBy: id_ASC, limit: 5, where: {owner_eq: "${address}"}) {
                        ${Object.keys(new Como).join('\n')}
                    }
                    objekts(limit: 1, orderBy: received_ASC, where: {owner_eq: "${address}"}) {
                        received
                    }
                }
            `
        })
    });

    const query = await res.json();

    return {
        balances: query.data.comos,
        joinDate: new Date(Number(query.data.objekts[0].received))
    };
}