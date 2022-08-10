import React, {Component} from "react";
import CreateOrder from './CreateOrder';
import AgentList from '../AgentList';
import {StackNavigator} from 'react-navigation';
import Barcode from '../Barcode';

export default (DrawNav = StackNavigator({
    CreateOrder: {screen: CreateOrder},
    AgentList: {screen: AgentList},
    Barcode: {screen: Barcode}
}));