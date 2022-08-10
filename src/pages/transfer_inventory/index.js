import React, {Component} from "react";
import TransferInventory from './TransferInventory';
import AgentList from '../AgentList';
import Barcode from '../Barcode';
import {StackNavigator} from 'react-navigation';

export default (DrawNav = StackNavigator({
    TransferInventory: {screen: TransferInventory},
    Barcode: {screen: Barcode},
    AgentList: {screen: AgentList}
}));