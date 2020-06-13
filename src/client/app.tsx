import * as React from 'react';
import io from 'socket.io-client';
import "./style.scss"
import DeviceTypesSelect from "./containers/device-types-select";
import Display from "./containers/display";
import RemoteController from "./containers/remote-control";

const apId = "8ba054fe-7d3f-4d89-83a9-805b14c4c8cd";
const sec = "crewnjWhKCUYpmBY8Q5ObxdfonXQq/7Wf7ICiLedD2A=";

const dev = location && location.hostname == "localhost" || false;
const serverUrl = dev ? "http://localhost:3333" : "";
let socket = io(serverUrl);

let typeDevice = localStorage.getItem("typeDevice") || null;

enum DeviceTypes {
    controller = 'controller',
    display = 'display'
}
const device: any = {};

export default class App extends React.Component<{},{}> {
    state = {
        id: null,
        deviceType: null,
        dashboard: null,
        screens: [],
        dashboards: [],
        filter: null
        // boardsToScreens: []
    };

    componentDidMount() {
        socket.on('message',console.log);
        socket.on('id', (id) => {
            this.setState({
                id
            })
        });

        socket.on('dashboard', (dashboard) => {
            console.log('new dashboard!', dashboard);
            this.setState({
                dashboard
            })
        });

        socket.on('ctrlData', (data) => {
            this.setState({
                dashboards: data.dashboards,
                screens: data.screens
            })
        });

        socket.on('type', (deviceType) => {
            this.setState({
                deviceType
            })
        });

        socket.on('filter', filter => {
            this.setState({ filter })
        })
    }

    ctrlChose() {
        socket.emit("typechose", "controller")
    }

    dsplChose() {
        socket.emit("typechose", "display")
    }

    handleSetFilter(dashboard, filter) {
        socket.emit('filter', { dashboard, filter });
    }

    onSetScreenBoard(screen, dashboard) {
        socket.emit("moveBoard", {
            dashboard,
            screen
        })

        // this.context.setState({
        //     ...this.state,
        //     boardsToScreens: this.context.state.boardsToScreens.concat({
        //         dashboard,
        //         screen
        //     })
        // })
    }

    findBoard (screen) {
        // console.log(screen, this.state.boardsToScreens , this.state.boardsToScreens.find((el) => {
        //     return el.screen == screen
        // }))
        // return this.state.boardsToScreens.find((el) => {
        //     return el.screen == screen
        // }).dashboard
    }

    render() {
        const { deviceType, id: displayId, dashboard, dashboards, screens, filter } = this.state;

        switch (deviceType) {
            case DeviceTypes.display:
                return <Display displayId={displayId} dashboard={dashboard} filter={filter} setFilter={this.handleSetFilter} />;
            case DeviceTypes.controller:
                return <RemoteController setFilter={this.handleSetFilter} dashboards={dashboards} screens={screens} setScreenBoard={this.onSetScreenBoard} />;
            default:
                return <DeviceTypesSelect onDsplChose={this.dsplChose} onCtrlChose={this.ctrlChose} />
        }

    }
}