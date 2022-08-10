import React, {Component} from "react";
import Home from './Home';
import SideBar from '../sidebar/SideBar';
import ActivityReport from '../activity_report';
import Agent from '../agent';
import SendApplication from '../send_application';
import CreateOrder from '../create_order';
import TransferInventory from '../transfer_inventory';
import OrderList from '../view_orders';
import AddRMA from '../add-rma';
import RMAList from '../rma';
import TotalBatch from '../total_batch';
import OnHandReportList from '../onhand_report';
import EventList from '../event';

import {DrawerNavigator} from 'react-navigation';

export default (DrawNav = DrawerNavigator({
        Home: {screen: Home},
        EventList: {screen: EventList},
    },
    {
        contentComponent: props => <SideBar {...props} />
    }));