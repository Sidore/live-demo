import * as React from 'react';
import io from 'socket.io-client';

const dev = location && location.hostname == "localhost" || false;
const serverUrl = dev ? "http://localhost:3333" : "";
let socket = io(serverUrl);

let typeDevice = localStorage.getItem("typeDevice") || null

const device: any = {}


export default class Page extends React.Component<{},{}> {

    constructor(props) {
        super(props);

    }

    state = {
        device: null,
        deviceType: null,
        screens: [],
        dashboards: []
    }

    props: any = {
      
    }

    componentDidMount() {
        // this.getGamesList();
    }

    

    ctrlChose: () => {
        
    }

    dsplChose: () => {

    }

    render() {

        let res;

        if(!this.state.deviceType) {
            res = <div>
                <button onClick={this.ctrlChose} >Controller</button> | <button onClick={this.dsplChose} >Display</button>
            </div>
        }
        
        return res;

    }
}