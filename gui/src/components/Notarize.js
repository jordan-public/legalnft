// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import { Button } from 'react-bootstrap';
// import fs from 'fs';
// import { Web3Storage } from 'web3.storage';

function Notarize(props) {
    const onNotarize = (e) => {
        e.preventDefault();
        window.web3.eth.getAccounts().then(async a => {
            const CID = (await window.ipfs.files.stat(props.agrRoot)).cid;
            try {
                await window.ipfs.pin.add(CID);
                // For now Pinata will pin the above as configured in my IPFS node
                // Here we should use the Estuary to transfer the pinned content to FileCoin
                console.log("Pinned: ", CID.toString())
            } catch(e) { console.log("Error pinning to IPFS"); console.log(e) }
// Abandoned solution: files are already in IPFS.
// there should be a simpler way to pint them to FileCoin
//            try {
//                const apiToken = fs.readFileSync("../private/web3.storage.api-key").toString().trim();
//                const client = new Web3Storage({ token: apiToken });
//                const chunks = []
//                for await (const chunk of window.ipfs.files.read(props.agrRoot)) {
//                    chunks.push(chunk)
//                }
//                const files = [
//                    new File(concat(chunks), '/'),
//                ]          
//                await client.put(reader);
//            } catch(_) { console.log("Error uploading to FileCoin.") }
            window.agreementContract.methods.mint(a[0], CID.toString()).send({ from: a[0] })
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