// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Table, Form, Button, InputGroup, FormControl, Col, Card } from 'react-bootstrap';
import AgreementListItem from './AgreementListItem';

function AgreementList(props) {
    const refTitle = React.useRef();
    const refCid = React.useRef();
    const [myTokens, setMyTokens] = React.useState([]);
    const [tokenTransferred, setTokenTransferred] = React.useState(0);

    const onCreate = async (e) => {
        e.preventDefault();
        const agrRoot = `/agr-${Math.random()}`;
        try {
            await window.ipfs.files.mkdir(agrRoot + '/documents', { parents: true });
            await window.ipfs.files.mkdir(agrRoot + '/signatures', { parents: true });
            await window.ipfs.files.write(agrRoot + '/title.txt', new TextEncoder().encode(refTitle.current.value), { create: true, parents: true, truncate: true });
            props.setAgrRoot(agrRoot);
            props.setActiveTab("agr");
        } catch (e) { console.log(e); window.alert("Error") }
     }

    const onOpen = async (e) => {
        e.preventDefault();
        // await window.ipfs.get(refCid.current.value);
        const agrRoot = `/agr-${Math.random()}`;
        try {
            await window.ipfs.files.cp('/ipfs/' + refCid.current.value, agrRoot);
            props.setAgrRoot(agrRoot);
            props.setActiveTab("agr");  
        } catch (_) { window.alert("CID Does not exist. Use CID, not name!") }
    }

    React.useEffect(() => {
        async function getTokens() {
            const account = (await window.web3.eth.getAccounts())[0];
            if (typeof account === "undefined") return;
            const numTokens = await window.agreementContract.methods.balanceOf(account).call();
            const tokenList = [];
            for (let i=0; i<numTokens; i++) {
                tokenList.push(await window.agreementContract.methods.tokenOfOwnerByIndex(account, i).call());
            }
            setMyTokens(tokenList);
        }
        getTokens();
    }, [props.tokenAdded, tokenTransferred]); // !!! dependency should be "dirty" flag

    return (<>
        <br />
        <Card>
            <Card.Header>Create new agreement:</Card.Header>
            <Card.Body>
                <Form>
                    <Form.Row className="align-items-center">
                        <Col>
                            <InputGroup className="mb-2">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Title</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl id="inlineFormInputGroup" ref={refTitle} placeholder="type here" />
                            </InputGroup>
                        </Col>
                        <Col>
                            <Button onClick={onCreate} className="mb-2">
                                Create
                            </Button>
                        </Col>
                    </Form.Row>
                </Form>
            </Card.Body>
        </Card>
        <br />
        <Card>
            <Card.Header>Open agreement:</Card.Header>
            <Card.Body>
                <Form>
                    <Form.Row className="align-items-center">
                        <Col>
                            <InputGroup className="mb-2">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Document CID</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl id="inlineFormInputGroup" ref={refCid} placeholder="paste here" />
                            </InputGroup>
                        </Col>
                        <Col>
                            <Button onClick={onOpen} className="mb-2">
                                Open
                            </Button>
                        </Col>
                    </Form.Row>
                </Form>
            </Card.Body>
        </Card>
        <br />
        <Card>
            <Card.Header>Signed agreements:</Card.Header>
            <Card.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Timestamp</th>
                            <th>Open</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myTokens.map((tokenID) => <AgreementListItem key={tokenID} tokenID={tokenID} setAgrRoot={props.setAgrRoot} setActiveTab={props.setActiveTab} setTokenTransferred={setTokenTransferred}/>)}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    </>);
}

export default AgreementList;