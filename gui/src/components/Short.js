// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import { OverlayTrigger, Tooltip} from 'react-bootstrap';

function Short(props) {
    const [shortText, setShortText] = React.useState("");

    React.useEffect(() => {
        if (props.children.length > 5 + props.length) {
            setShortText(props.children.substring(0, (props.length - 3) / 2) + '...' + props.children.substring(props.children.length - props.length + (props.length - 3) / 2 + 3));
        } else {
            setShortText(props.children);
        }
    }, [props]);

    return(
        <OverlayTrigger overlay={
            <Tooltip id="tooltip-disabled">
                {props.children}
            </Tooltip>}>
            <span>{shortText}</span>
        </OverlayTrigger>
    );
}

Short.defaultProps = { length: 12 };

export default Short;