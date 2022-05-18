// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Table, Button, Form, Col, InputGroup, FormControl, Card } from 'react-bootstrap';
import Document from './Document';
import all from 'it-all';
import Dropzone from 'react-dropzone'

function DocumentList(props) {
    const refTitle = React.useRef();
    const refValue = React.useRef();
    const [docs, setDocs] = React.useState([]);

    const onAddFieldDoc = async (e) => {
        e.preventDefault();
        console.log(refTitle.current.value);
        console.log(refValue.current.value);
        try {
            await window.ipfs.files.write(props.agrRoot + '/documents/' + refTitle.current.value + '.txt', new TextEncoder().encode(refValue.current.value), { create: true, parents: true, truncate: true });
        } catch (_) { window.alert("Error.") }
        refresh();
    }

    const onUpload = async (files) => {
        await Promise.all(
            files.map(file => {
              return window.ipfs.files.write(props.agrRoot + '/documents/' + file.name, file, { create: true, parents: true, truncate: true })
                .catch(error => console.error(error));
            })
        );
        refresh();
    }

    const refresh = async () => {
        const ar = props.agrRoot; // For consistency
        if ("" === ar) return;
        let directoryContents = []
        try {
            for await (const file of window.ipfs.files.ls(ar + '/documents')) {
                directoryContents.push(file);
            }
            setDocs(directoryContents.filter(file => file.type === "file").map(file => { return({ file: file.name, agrRoot: ar }); }));
        } catch (_) { console.log("Error listing " + ar + '/documents')}
        props.setDirty();
    }

    React.useEffect(() => {
        refresh();
    }, [props.agrRoot]);

    return (<>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Open</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {docs.map((doc) => <Document key={doc} file={doc.file} agrRoot={doc.agrRoot} refresh={refresh}/>)}
            </tbody>
        </Table>
        <Card>
            <Card.Header>Add document:</Card.Header>
            <Card.Body>
                <Form>
                    <Form.Row className="align-items-center">
                        <Col>
                            <InputGroup className="mb-2">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Title</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl ref={refTitle} placeholder="type here" />
                            </InputGroup>
                        </Col>
                        <Col>
                            <InputGroup className="mb-2">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Value</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl ref={refValue} placeholder="paste here" />
                            </InputGroup>
                        </Col>
                        <Col>
                            <Button onClick={onAddFieldDoc} className="mb-2">
                                Enter
                            </Button>
                        </Col>
                    </Form.Row>
                </Form>
                <br />
                Or:
                <br />
                <Dropzone onDrop={onUpload}>
                    {({ getRootProps, getInputProps }) => (
                        <Card border="dark" bg="light">
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            </div>
                        </Card>
                    )}
                </Dropzone>
            </Card.Body>
        </Card>
    </>);
}

export default DocumentList;