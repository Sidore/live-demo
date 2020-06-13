import * as React from "react";
import { useCallback } from "react";
import { Draggable, Droppable } from 'react-drag-and-drop'

const filter = {
    $schema: "http://powerbi.com/product/schema#basic",
    target: {
        table: "Store",
        column: "Chain"
    },
    operator: "In",
    values: ["Lindseys"]
};

const RemoteController = ({ dashboards, screens, setScreenBoard, setFilter }): JSX.Element => {
    const onDropElement = useCallback(screen => ({ dashboard }) =>{
        console.log('moved', dashboard, ' to ', screen);
        setScreenBoard(screen, dashboard);
    }, []);

    const onApplyFilter = useCallback((dashboard) => e => {
        console.log('dashboard', dashboard);
        setFilter(dashboard, filter);
    }, []);

    return <div className="controlContainer">
        <div className="dashboardsContainer">
            <h2>Dashboards</h2>
            <ul className="dashboardsList">
                {dashboards.map(
                    (element, key) => (
                        <React.Fragment key={element}>
                        <Draggable type="dashboard" data={element}>
                            <li>
                                {element} <button name="filter" onClick={onApplyFilter(element)}>filter </button>
                            </li>
                        </Draggable>
                        </React.Fragment>
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