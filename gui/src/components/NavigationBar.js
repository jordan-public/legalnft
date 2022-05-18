// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Navbar } from 'react-bootstrap';
import Account from './Account';

function NavigationBar() {
    return (
        <Navbar className="bg-light justify-content-between">
            <Navbar.Brand variant="primary">Legal NFT</Navbar.Brand>
            <Navbar.Text> <Account/> </Navbar.Text>
        </Navbar>
    );
}

export default NavigationBar;