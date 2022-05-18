// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import toBuffer from 'it-to-buffer';
import { Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';

function AgreementListItem(props) {
    const [tokenCID, setTokenCID] = React.useState("");
    const [tokenTitle, setTokenTitle] = React.useState("");
    const [tokenTS, setTokenTS] = React.useState("");
    const refDestAdr = React.useRef();
    // Modal control
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    React.useEffect(() => {
        async function getToken() {
            const tokenURI = await window.agreementContract.methods.tokenURI(props.tokenID).call();
            const CID = tokenURI.substring(tokenURI.lastIndexOf('/') + 1);
            setTokenCID(CID);
            setTokenTitle(new TextDecoder().decode(await toBuffer(window.ipfs.cat(CID + "/title.txt"))));
            setTokenTS(await window.agreementContract.methods.tokenTS(props.tokenID).call());
        }
        getToken();
    }, [props.tokenID]);

    const onOpen = async (e) => {
        e.preventDefault();
        const agrRoot = `/agr-${Math.random()}`;
        await window.ipfs.files.cp('/ipfs/' + tokenCID, agrRoot);
        props.setAgrRoot(agrRoot);
        props.setActiveTab("agr");
    }

    const onTransfer = async (e) => {
        e.preventDefault();
        window.web3.eth.getAccounts().then(async a => {
            window.agreementContract.methods.transferFrom(a[0], refDestAdr.current.value, props.tokenID).send({ from: a[0] })
                .then(result => {
                    props.setTokenTransferred(props.tokenID);
                })
                .catch(error => {
                    console.log("Transaction error: " + error);
                    window.alert("Transaction error: " + error.message);
                });
        });
        handleClose();
    }

    const modal = (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Row className="align-items-center">
                        <InputGroup className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Transfer to:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl ref={refDestAdr} placeholder="destination account here" />
                        </InputGroup>
                    </Form.Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button onClick={onTransfer}>Send</Button>
            </Modal.Footer>
        </Modal>
    );


    return (
        <tr>
            <td>{tokenTitle}</td>
            <td>{new Date(tokenTS * 1000).toUTCString()}</td>
            <td><Button variant="primary" onClick={onOpen}>Open</Button> {" "}
                <Button variant="primary" onClick={handleShow}>Transfer</Button>{modal}</td>
        </tr>
    );
}

export default AgreementListItem;