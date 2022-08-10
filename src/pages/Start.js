import React, {Component} from "react";
import Home from './home';
import ActivityReport from './activity_report';
import Agent from './agent';
import SideBar from './sidebar/SideBar';
import {DrawerNavigator} from 'react-navigation';
import SendApplication from './send_application';
import CreateOrder from './create_order';
import TransferInventory from './transfer_inventory';
import OrderList from './view_orders';
import AddRMA from './add-rma';
import RMAList from './rma';
import TotalBatch from './total_batch';
import OnHandReportList from './onhand_report';

const SideMenuRouter = DrawerNavigator(
    {
        Home: {screen: Home},
        Agent: {screen: Agent},
        SendApplication: {screen: SendApplication},
        CreateOrder: {screen: CreateOrder},
        TransferInventory: {screen: TransferInventory},
        OrderList: {screen: OrderList},
        AddRMA: {screen: AddRMA},
        RMAList: {screen: RMAList},
        TotalBatch: {screen: TotalBatch},
        OnHandReportList: {screen: OnHandReportList},
        ActivityReport: {screen: ActivityReport}
    },
    {
        contentComponent: props => <SideBar {...props} />
    }
);
export default SideMenuRouter;