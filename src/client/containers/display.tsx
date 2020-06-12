import * as React from "react";
import * as pbi from 'powerbi-client';
import {useEffect, useRef} from "react";
import { access } from '../access/const';

const Log = Object.freeze({
    logText: (...args) => {
        console.log(...args);
    },
    log: (...args) => {
        console.log(...args);
    }
});

const Display = ({ dashboard, displayId }): JSX.Element => {
    const powerBiPanel = useRef(null);

    useEffect(() => {
        if (dashboard) {
            // Read embed application token from textbox

            const txtAccessToken = dashboard.AccessToken;

// Read embed URL from textbox
            const txtEmbedUrl = dashboard.EmbedUrl;

// Read report Id from textbox
            const txtEmbedReportId = dashboard.EmbedId;

// Read embed type from radio
            const tokenType = '1';

// Get models. models contains enums that can be used.
            const models = pbi.models;

// We give All permissions to demonstrate switching between View and Edit mode and saving report.
            const permissions = models.Permissions.All;

// Embed configuration used to describe the what and how to embed.
// This object is used when calling powerbi.embed.
// This also includes settings and options such as filters.
// You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
            const config: any = {
                type: 'report',
                tokenType: tokenType !== '1' ? models.TokenType.Aad : models.TokenType.Embed,
                accessToken: txtAccessToken,
                embedUrl: txtEmbedUrl,
                id: txtEmbedReportId,
                permissions: permissions,
                settings: {
                    panes: {
                        filters: {
                            visible: true
                        },
                        pageNavigation: {
                            visible: true
                        }
                    }
                }
            };

// Get a reference to the embedded report HTML element
            const embedContainer = powerBiPanel.current;

// Embed the report and display it within the div container.
            const report = window.powerbi.embed(embedContainer, config);

// Report.off removes a given event handler if it exists.
            report.off("loaded");

// Report.on will add an event handler which prints to Log window.
            report.on("loaded", function () {
                Log.logText("Loaded");
            });

// Report.off removes a given event handler if it exists.
            report.off("rendered");

// Report.on will add an event handler which prints to Log window.
            report.on("rendered", function () {
                Log.logText("Rendered");
            });

            report.on("error", function (event) {
                Log.log(event.detail);

                report.off("error");
            });

            report.off("saved");
            report.on("saved", function (event) {
                Log.log(event.detail);
                if ((event.detail as any).saveAs) {
                    Log.logText('In order to interact with the new report, create a new token and load the new report');
                }
            });
        }
    }, [dashboard?.AccessToken, dashboard?.EmbedUrl, dashboard?.EmbedId]);
    let w = window.innerWidth - 5;
    if (w > 1200) w = 1200;
    let h = window.innerHeight - 5;

    return dashboard ? (
        <div ref={powerBiPanel} style={{
            width: `${w}px`,
            height: `${h}px`
        }}/>
    ) : <h1 className="displayNumber">Display #{displayId} <hr/> Waiting for Controller</h1>
    // return dashboard
    //     ? <iframe
    //         width={w}
    //         height={h}
    //         frameBorder="0"
    //         allowFullScreen
    //         src={dashboard} />
    //     : <h1 className="displayNumber">Display #{displayId} <hr/> Waiting for Controller</h1>
};

export default Display;