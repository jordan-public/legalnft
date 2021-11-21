// SPDX-License-Identifier: BUSL-1.1
import MetaMaskOnboarding from '@metamask/onboarding';
import React from 'react';
import { Button } from 'react-bootstrap';

const ONBOARD_TEXT = 'Activate MetaMask or Click here to install!';
const CONNECT_TEXT = 'Connect';
const CONNECTED_TEXT = 'Unlocked - click to connect';

export function OnboardingButton() {
  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const onboarding = React.useRef();

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        // setDisabled(true);
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  React.useEffect(() => {
    function handleNewAccounts(newAccounts) {
      setAccounts(newAccounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleNewAccounts);
      window.ethereum.on('accountsChanged', handleNewAccounts);
      return () => {
        window.ethereum.on('accountsChanged', handleNewAccounts);
      };
    }
  }, []);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.location.reload(); return;// This line fixes MetaMask connection bug 
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(newAccounts => setAccounts(newAccounts));
    } else {
      onboarding.current.startOnboarding();
    }
  };

  return (
    <Button variant="light" disabled={isDisabled} onClick={onClick}>
      {buttonText}
    </Button>
  );
}

export default OnboardingButton;