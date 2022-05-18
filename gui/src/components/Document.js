// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button } from 'react-bootstrap';
import { concat } from 'uint8arrays/concat';
import { toString } from 'uint8arrays/to-string';

function Document(props) {
    const [content, setContent] = React.useState("");
    const [url, setUrl] = React.useState("about:blank");
    const [removed, setRemoved] = React.useState(false);

    React.useEffect(() => {
        async function getInfo() {
            if (props.file.endsWith('.txt')) {
                try {
                    const chunks = []
                    for await (const chunk of window.ipfs.files.read(props.agrRoot + "/documents/" + props.file)) {
                      chunks.push(chunk)
                    }
                    setContent(toString(concat(chunks)));
                } catch(_) { console.log("Can't read document." + props.agrRoot + "/documents/" + props.file) }
            } else {
                setUrl('https://ipfs.io/ipfs/'+(await window.ipfs.files.stat(props.agrRoot + "/documents/" + props.file)).cid.toString());
            }
        };
        if (!removed) getInfo();
    }, [removed]);

    const onDelete = async () => {
        setRemoved(true);
        await window.ipfs.files.rm(props.agrRoot + "/documents/" + props.file);
        props.refresh();
    }

    return (
        <tr>
            <td>{props.file.endsWith(".txt")?props.file.slice(0, -4):props.file}</td>
            <td>{props.file.endsWith(".txt") ?
                    content :
                    <Button href={url} variant="link" target="_blank">Open</Button>}</td>
            <td><Button onClick={onDelete}>x</Button></td>
        </tr>
    );
}

export default Document;