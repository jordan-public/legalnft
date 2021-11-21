import React from 'react';
import { Button } from 'react-bootstrap';

function Notarize(props) {
    const onNotarize = (e) => {
        e.preventDefault();
        window.web3.eth.getAccounts().then(async a => {
            window.agreementContract.methods.mint(a[0], (await window.ipfs.files.stat(props.agrRoot)).cid.toString()).send({ from: a[0] })
                .then(tokenID => {
console.log("Result=tokenID? : ");
console.log(tokenID);
                    props.setTokenAdded(tokenID);
                })
                .catch(error => {
                    console.log("Transaction error: " + error);
                    window.alert("Transaction error: " + error.message);
                });
        });
    }

    return (
        <Button onClick={onNotarize}>Notarize agreement</Button>
    );
}

export default Notarize;