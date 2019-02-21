import * as config from '@/config';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';


ScatterJS.plugins(new ScatterEOS());
const eos = () => ScatterJS.scatter.eos(config.network2.eos, Eos, { expireInSeconds: 60 });
const currentEOSAccount = () => ScatterJS.scatter.identity && ScatterJS.scatter.identity.accounts.find(x => x.blockchain === 'eos');

export const login = async () => {
    const requiredFields = { accounts: [config.network2] };
    return ScatterJS.scatter.getIdentity(requiredFields);
}