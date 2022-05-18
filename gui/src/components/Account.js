// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import OnboardingButton from './OnboardingButton';
import Web3 from 'web3';

function Account() {
    const [account, setAccount] = React.useState(null);

    React.useEffect(() => {
        if (!window.ethereum) return;
        window.ethereum.on('accountsChanged', accounts => { setAccount(accounts[0]); window.location.reload(); });
        window.ethereum.on('chainChanged', (chainId) => { window.location.reload(); });
        window.ethereum.on('disconnect', (error) => { window.location.reload(); });
    }, []);

    React.useEffect(() => {
        if (window.ethereum && account === null) window.ethereum.request({ method: 'eth_accounts' }).then(a => {
            setAccount(a[0]);
        });
    
        if (window.ethereum && !window.web3.version) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
        }
    });

    if (account) return (<>Account: {account}</>);
    else return(<OnboardingButton/>);
}

export default Account;