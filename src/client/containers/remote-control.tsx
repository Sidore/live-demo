import * as React from "react";
import { useCallback } from "react";
import { Draggable, Droppable } from 'react-drag-and-drop'

const filters = [{
    id: 0,
    name: '---'
},{
    id: 1,
    name: 'Lindseys',
    data: {
        $schema: "http://powerbi.com/product/schema#basic",
        target: {
            table: "Store",
            column: "Chain"
        },
        operator: "In",
        values: ["Lindseys"]
    }
}, {
    id: 2,
    name: 'Fashions Direct',
    data: {
        $schema: "http://powerbi.com/product/schema#basic",
        target: {
            table: "Store",
            column: "Chain"
        },
        operator: "In",
        values: ["Fashions Direct"]
    }
}];

const RemoteController = ({ dashboards, screens, setScreenBoard, setFilter }): JSX.Element => {
    const onDropElement = useCallback(screen => ({ dashboard }) =>{
        setScreenBoard(screen, dashboard);
    }, []);

    const onApplyFilter = useCallback((dashboard) => e => {
        const { target } = e;
        const filterId: number = target.value * 1;
        const filter = filters.find(({ id }) => id === filterId);
        if (filter?.data) {
            setFilter(dashboard, filter.data);
        } else {
            // TODO: resetFilterFunctionality - can be done by calling report.resetFilters();
        }
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
                                <span className="dashboardsList__item-name">{element}</span>
                                <label className="dashboardsList__item-filters"><span>Filters:</span>
                                    <select name="filters" onChange={onApplyFilter(element)} defaultValue="0">
                                        {filters.map(filter => <option key={filter.id} value={filter.id}>{filter.name}</option>)}
                                    </select>
                                </label>
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
                            <li>Display #{element.id} {element.dashboard ? ` - ${element.dashboard}` : ""}</li>
                        </Droppable>
                    )
                )}
            </ul>
        </div>
    </div>
};

export default RemoteController;