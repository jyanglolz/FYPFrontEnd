import React, { useState } from 'react';
import { Spinner } from 'reactstrap';

export default function LoadingScreen() {
    const [overlayStyle, setOverlayStyle] = useState({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "fixed",
        width: "15%",
        height: "15%",
        backgroundColor: "black",
        opacity: 0.5,
        color: "white",
        zIndex: 1100
    });

    const [spinnerStyle, setSpinnerStyle] = useState({
        width: 80,
        height: 80
    });

    const [messageStyle, setMessageStyle] = useState({
        fontSize: 18,
        marginTop: 10
    });

    return (
        <div style={overlayStyle}>
            <Spinner color="light" style={spinnerStyle} />
            <div style={messageStyle}>Loading....</div>
        </div>
    );
}
