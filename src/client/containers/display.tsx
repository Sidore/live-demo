import * as React from "react";

const Display = ({ dashboard, displayId }): JSX.Element => {
    let w = window.innerWidth - 5;
    if (w > 1200) w = 1200;
    let h = window.innerHeight - 5;

    return dashboard
        ? <iframe
            width={w}
            height={h}
            frameBorder="0"
            allowFullScreen
            src={dashboard} />
        : <h1 className="displayNumber">Display #{displayId} <hr/> Waiting for Controller</h1>
};

export default Display;