// SPDX-License-Identifier: Apache-2.0 and MIT
import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Accordion, Card, Button } from 'react-bootstrap';
import DocumentList from './DocumentList';
import SignatureList from './SignatureList';
import Notarize from './Notarize';
import { concat } from 'uint8arrays/concat';
import { toString } from 'uint8arrays/to-string';

function Agreement(props) {
    const [title, setTitle] = React.useState("");
    const [agrCID, setAgrCid] = React.useState("");
    const [changeFlip, setChangeFlip] = React.useState(false);
    const setDirty = () => {setChangeFlip(!changeFlip);}

    useEffect(() => {
        (async function readTitle() {
            if ("" !== props.agrRoot) {
                try {
                    const chunks = []
                    for await (const chunk of window.ipfs.files.read(props.agrRoot + "/title.txt")) {
                      chunks.push(chunk)
                    }
                    setTitle(toString(concat(chunks)));
                } catch(_) { console.log("Can't read title from " + props.agrRoot + "/title.txt") }
            }
        })();
    }, [props.agrRoot]);

    useEffect(() => {
        (async function readTitle() {
            if ("" !== props.agrRoot) {
                const CID = (await window.ipfs.files.stat(props.agrRoot)).cid.toString();
                setAgrCid(CID);
            }
        })();
    }, [changeFlip, props.agrRoot]);

    return (<>
        <Card>
            <Card.Header>Agreement title: {title}</Card.Header>
            <Card.Body>Agreement CID: {agrCID}</Card.Body>
        </Card>
        <Accordion defaultActiveKey="0">
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        Documents
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <DocumentList agrRoot={props.agrRoot} setDirty={setDirty}/>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        <Accordion defaultActiveKey="1">
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                        Signatures
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>
                        <SignatureList agrRoot={props.agrRoot} setDirty={setDirty}/>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        <Card>
            <Card.Header>
                <Notarize agrRoot={props.agrRoot} setTokenAdded={props.setTokenAdded}/>
            </Card.Header>
        </Card>

    </>);
}

export default Agreement;