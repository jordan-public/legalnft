// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import * as IPFS from 'ipfs-core';
import NavigationBar from './components/NavigationBar';
import Body from './components/Body';
import agreementArtifact from "./contracts/Agreement.json";
import Web3 from 'web3';


function App() {
  const [readyIPFS, setReadyIPFS] = React.useState(false);
  const [readyContract, setReadyContract] = React.useState(false);

  React.useEffect(() => {
    async function getIPFS() {
      if (typeof window.ipfs === "undefined") {
        window.ipfs = await IPFS.create();
        console.log("Using embedded IPFS node.");
      } else {
        console.log("Using local IPFS node.");
      }
      setReadyIPFS(true);
    };
    getIPFS();
  }, []);

  React.useEffect(() => {
    async function getContract() {
      const networkId = await window.web3.eth.net.getId();
      console.log("Network ID: "+networkId);
      const deployedNetwork = agreementArtifact.networks[networkId];
      window.agreementContract = new window.web3.eth.Contract(
        agreementArtifact.abi,
        deployedNetwork.address,
      );
      setReadyContract(true);
    }

    if (window.ethereum && !window.web3.version) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
    }

    if (window.web3 && window.web3.eth) getContract();
  }, [window.web3]);

  if (!readyIPFS || !readyContract || !window.web3 || !window.web3.eth) return (<> <NavigationBar /> <br/> "Loading..." </>);
  return (<>
    <NavigationBar />
    <br />
    <Body />
  </>);
}

export default App;