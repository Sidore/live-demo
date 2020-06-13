import * as React from "react";
import * as pbi from 'powerbi-client';

const Log = Object.freeze({
    logText: (...args) => {
        console.log(...args);
    },
    log: (...args) => {
        console.log(...args);
    }
});

class Display extends React.Component<any, any> {
    wrapper = React.createRef();
    state = { isInit: false };

    onDataSelected({ detail }){
        console.log('data selected');
        Log.log(detail);
        console.log('Filters', detail.filters);
        if (detail.filters) {
            this.props.setFilter(this.props.dashboard.displayName, detail.filters);
        }
    }

    initPowerBI() {
        const me = this;
        const { dashboard } = this.props;
        const powerbi = window.powerbi;
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
                filterPaneEnabled: false,
                panes: {
                    filters: {
                        visible: true,
                        expanded: false
                    }
                }
            }
        };

// Get a reference to the embedded report HTML element
        const embedContainer = this.wrapper.current;

// Embed the report and display it within the div container.
        const report = powerbi.embed(embedContainer, config);

        report.off("filtersApplied");
        report.on('filtersApplied', ({ detail }) => {
            console.log(' applied filter event', detail)
        });

// Report.off removes a given event handler if it exists.
        report.off("loaded");

// Report.on will add an event handler which prints to Log window.
        report.on("loaded", function () {
            Log.logText("Loaded");
        });

        report.off('dataSelected');
        report.on('dataSelected', this.onDataSelected.bind(this));

// Report.off removes a given event handler if it exists.
        report.off("rendered");
// Report.on will add an event handler which prints to Log window.
        report.on("rendered", function ({ detail }) {
            !me.state.isInit && me.setState({ isInit: true });
            Log.logText("Rendered");
            report.getFilters()
                .then(function (filters) {
                    Log.log('filters get');
                    Log.log(filters);
                })
                .catch(function (errors) {
                    Log.log(errors);
                });
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

    setPowerBIFilter(filter) {
        console.log('FILTERING!!!!');
        if (!filter) {
            return;
        }
        console.log('Applied filter', filter);
        const powerbi = window.powerbi;
        const report = powerbi.get(this.wrapper.current);
        // Set the filter for the report.
        // Pay attention that setFilters receives an array.
        report.setFilters(Array.isArray(filter)? [...filter] : [ filter])
            .then(function (result) {
                console.log('set success filter ', result);
            })
            .catch(function (errors) {
                console.log(errors);
            });
    }

    componentDidMount(): void {
        const { dashboard } = this.props;
        if (dashboard) {
            this.initPowerBI();
        }
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        if(!prevState.dashboard && this.props.dashboard && !this.state.isInit) {
            this.initPowerBI();
        }
        if (this.state.isInit && this.props.filter) {
            console.log('Hey new filter com in!', this.props.filter);
            this.setPowerBIFilter(this.props.filter);
        }
    }

    shouldComponentUpdate(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean {
        if ((this.state.isInit || nextState.isInit) && nextProps.filter) {
            this.setPowerBIFilter(nextProps.filter);
        }
        return this.props.dashboard !== nextProps.dashboard || this.props.displayId !== nextProps.displayId;
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { dashboard, displayId, filter } = this.props;
        let w = window.innerWidth - 5;
        if (w > 1200) w = 1200;
        let h = window.innerHeight - 5;

        return dashboard ? (
            <div ref={this.wrapper} style={{
                width: `${w}px`,
                height: `${h}px`
            }}/>
        ) : <h1 className="displayNumber">Display #{displayId} <hr/> Waiting for Controller</h1>
    }
}
export default Display;