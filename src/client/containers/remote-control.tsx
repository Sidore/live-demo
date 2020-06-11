import * as React from "react";
import { useCallback } from "react";
import { Draggable, Droppable } from 'react-drag-and-drop'

const RemoteController = ({ dashboards, screens, setScreenBoard }): JSX.Element => {
    const onDropElement = useCallback(screen => ({ dashboard }) =>{
        console.log('moved', dashboard, ' to ', screen);
        setScreenBoard(screen, dashboard);
    }, []);

    return <div className="controlContainer">
        <div className="dashboardsContainer">
            <h2>Dashboards</h2>
            <ul className="dashboardsList">
                {dashboards.map(
                    (element, key) => (
                        <Draggable type="dashboard" key={key} data={element}>
                            <li>
                                {element}
                            </li>
                        </Draggable>
                    )
                )}
            </ul>
        </div>
        <div className="screensContainer">
            <h2>Displays</h2>
            <ul className="screensList">
                {screens.map(
                    (element, key) => (
                        <Droppable key={key}
                            types={['dashboard']} // <= allowed drop types
                            onDrop={onDropElement(element)} >
                            {/*onDrop={onDropElement(element)}>*/}
                            <li>Display #{element.id} {element.dashboard ? ` - ${element.dashboard}` : ""}</li>
                        </Droppable>
                    )
                )}
            </ul>
        </div>
    </div>
};

export default RemoteController;