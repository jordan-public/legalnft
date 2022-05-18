// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Tabs, Tab } from 'react-bootstrap';
import Agreement from './Agreement';
import AgreementList from './AgreementList';

function Body() {
    const [activeTab, setActiveTab] = React.useState("list");
    const [agrRoot, setAgrRoot] = React.useState("");
    const [tokenAdded, setTokenAdded] = React.useState(0);

    const onSelect = (key) => {
        setActiveTab(key);
    }

    return (
        <Tabs activeKey={activeTab} transition={false} id="noanim-tab-example" onSelect={onSelect}>
            <Tab eventKey="list" title="List">
                <AgreementList setActiveTab={setActiveTab} setAgrRoot={setAgrRoot} tokenAdded={tokenAdded}/>
            </Tab>
            <Tab eventKey="agr" title="Agreement">
                <Agreement agrRoot={agrRoot} setTokenAdded={setTokenAdded}/>
            </Tab>
        </Tabs>
    );
}

export default Body;