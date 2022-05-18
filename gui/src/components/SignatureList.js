// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Table, Card, Button } from 'react-bootstrap';
import all from 'it-all';
import Signature from './Signature';

function SignatureList(props) {
    const [sigs, setSigs] = React.useState([]);

    const onSign = async (e) => {
        e.preventDefault();
        const docCID = (await window.ipfs.files.stat(props.agrRoot + '/documents')).cid.toString();
        window.web3.eth.getAccounts().then(a => {
            window.web3.eth.personal.sign(docCID, a[0])
                .then(async s => {
                    await window.ipfs.files.write(props.agrRoot + '/signatures/' + a, new TextEncoder().encode(s), { create: true, parents: true, truncate: true });
                    refresh();
                })
                .catch(e => window.error(e));
        });
    }

    const refresh = async () => {
        props.setDirty();
        const ar = props.agrRoot; // For consistency
        if ("" === ar) return;
        const directoryContents = []
        try {
            for await (const file of window.ipfs.files.ls(ar + '/signatures')) {
                directoryContents.push(file);
            }
            setSigs(directoryContents.filter(file => file.type === "file").map(file => { return({ file: file.name, agrRoot: ar }); }));
        } catch (_) { console.log("Error listing " + ar + '/documents')}
    }

    React.useEffect(() => {
        refresh();
    }, [props.agrRoot]);

    return (<>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Signer</th>
                    <th>Signature</th>
                    <th>Verified</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {sigs.map((sig) => <Signature key={sig} file={sig.file} agrRoot={sig.agrRoot} refresh={refresh} />)}
            </tbody>
        </Table>
        <Card>
            <Card.Header>
                <Button onClick={onSign}>Sign agreement</Button>
            </Card.Header>
        </Card>
    </>);
}

export default SignatureList;