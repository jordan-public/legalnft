// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import toBuffer from 'it-to-buffer';
import { Button } from 'react-bootstrap';
import Short from './Short';
import { concat } from 'uint8arrays/concat';
import { toString } from 'uint8arrays/to-string';

function Signature(props) {
    const [content, setContent] = React.useState("");
    const [removed, setRemoved] = React.useState(false);
    const [verified, setVerified] = React.useState("Wait...");

    React.useEffect(() => {
        async function getInfo() {
//await new Promise(r => setTimeout(r, 2000));            
            try {
                const chunks = []
                for await (const chunk of window.ipfs.files.read(props.agrRoot + "/signatures/" + props.file)) {
                chunks.push(chunk)
                }
                setContent(toString(concat(chunks)));
            } catch(_) { console.log("Can't read title from " + props.agrRoot + "/signatures/" + props.file) }
            const docCID = (await window.ipfs.files.stat(props.agrRoot + '/documents')).cid.toString();     
            window.web3.eth.personal.ecRecover(docCID, content)
                .then(sa => {
                    setVerified(props.file === window.web3.utils.toChecksumAddress(sa)?"Pass":"Fail");
                })
                .catch(e => { setVerified("Wait..."); }); // Ignore until content is set in the next rendering
        };
        if (!removed) getInfo();
    });
//    }, [removed, props.agrRoot]);

    const onDelete = async () => {
        setRemoved(true);
        await window.ipfs.files.rm(props.agrRoot + "/signatures/" + props.file);
        props.refresh();
    }

    return (
        <tr>
            <td><Short>{props.file}</Short></td>
            <td><Short>{content}</Short></td>
            <td>{verified}</td>
            <td><Button onClick={onDelete}>x</Button></td>
        </tr>
    );
}

export default Signature;