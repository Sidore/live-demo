import * as React from 'react';
import io from 'socket.io-client';
import { Draggable, Droppable } from 'react-drag-and-drop'
import "./style.scss"

const apId = "8ba054fe-7d3f-4d89-83a9-805b14c4c8cd";
const sec = "crewnjWhKCUYpmBY8Q5ObxdfonXQq/7Wf7ICiLedD2A=";

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
        dashboards: [],
        // boardsToScreens: []
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
        console.log(this.element,data)
        // => banana 
        socket.emit("moveBoard", {
            dashboard: data.dashboard,
            screen: this.element
        })

        // this.context.setState({
        //     ...this.state,
        //     boardsToScreens: this.context.state.boardsToScreens.concat({
        //         dashboard: data.dashboard,
        //         screen: this.element
        //     })
        // })
    }

    findBoard(screen) {
        console.log(screen, this.state.boardsToScreens , this.state.boardsToScreens.find((el) => {
            return el.screen == screen
        }))
        return this.state.boardsToScreens.find((el) => {
            return el.screen == screen
        }).dashboard
    }

    render() {

        let res;
        let w = window.innerWidth - 5;
        if (w > 1200) w = 1200;
        let h = window.innerHeight - 5;

        if(!this.state.deviceType) {
            res = <div className="typeContainer">
                <div>Choose type of this device</div>
                <div className="typeButtonContainer">
                    <button onClick={this.ctrlChose} className="typeButton">Controller <img src="https://images.vexels.com/media/users/3/131905/isolated/preview/38ccd201537b0891643deb3f322a1602-remote-controller-icon-by-vexels.png"/></button>
                    <button className="typeButton" onClick={this.dsplChose}>Display <img className="second" src="https://img.icons8.com/all/500/power-bi.png"/></button>
                </div>
            </div>
        } else {
            if (this.state.deviceType === 'display') {
                if(!this.state.dashboard) {
                    res = <h1 className="displayNumber">Display #{this.state.id} <hr/> Waiting for Controller</h1>
                } else {
                    res = <iframe width={w} height={h} frameborder="0" allowFullScreen="true" src={this.state.dashboard}></iframe>
                }
            } else {
                res = 
                <div className="controlContainer">
                    <div className="dashboardsContainer">
                        <h2>Dashboards</h2>
                        <ul className="dashboardsList">
                            {this.state.dashboards.map(element => {
                                return  <Draggable type="dashboard" data={element}>
                                                <li>
                                                {element}
                                                </li>
                                            </Draggable>
                                        
                            })}
                        </ul>
                    </div>
                    <div className="screensContainer">
                        <h2>Displays</h2>
                        <ul className="screensList">
                        {this.state.screens.map(element => {
                                return <Droppable
                                        types={['dashboard']} // <= allowed drop types
                                        onDrop={this.onDrop.bind({context: this, element})}>
                                            <li>Display #{element.id} {element.dashboard ? ` - ${element.dashboard}` : ""}</li>
                                        </Droppable>
                            })}
                        </ul>
                    </div>
                </div>
            }

        }
        
        return res;

    }
}