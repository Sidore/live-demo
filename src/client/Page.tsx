import * as React from 'react';
import io from 'socket.io-client';
import { Draggable, Droppable } from 'react-drag-and-drop'

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
        id: null,
        deviceType: null,
        dashboard: null,
        screens: [],
        dashboards: []
    }

    props: any = {
      
    }

    componentDidMount() {
        socket.on('message',(d) => console.log(d))
        socket.on('id', (id) => {
            this.setState({
                ...this.state,
                id
            })
        });

        socket.on('dashboard', (dashboard) => {
            this.setState({
                ...this.state,
                dashboard
            })
        })

        socket.on('ctrlData', (data) => {
            this.setState({
                ...this.state,
                dashboards: data.dashboards,
                screens: data.screens
            })
        })

        socket.on('type', (deviceType) => {
            this.setState({
                ...this.state,
                deviceType
            })
        })
    }



    ctrlChose() {
        socket.emit("typechose", "controller")
    }

    dsplChose() {
        socket.emit("typechose", "display")
    }

    onDrop(data) {
        console.log(data)
        // => banana 
    }

    render() {

        let res;

        if(!this.state.deviceType) {
            res = <div>
                <button onClick={this.ctrlChose} >Controller</button> | <button onClick={this.dsplChose} >Display</button>
            </div>
        } else {
            if (this.state.deviceType === 'display') {
                if(!this.state.dashboard) {
                    res = <h1>{this.state.id}</h1>
                } else {
                    res = <iframe src={this.state.dashboard}></iframe>
                }
            } else {
                res = <div>dashboards<ul>
                    {this.state.dashboards.map(element => {
                        return <li><Draggable type="dashboard" data={element}>{element}</Draggable></li>
                    })}
                </ul>screens
                <Droppable
                types={['dashboard']} // <= allowed drop types
                onDrop={this.onDrop.bind(this)}><ul>
                    
                {this.state.screens.map(element => {
                        return <li>{element}</li>
                    })}

                </ul>
                </Droppable>
                </div>
            }

        }
        
        return res;

    }
}