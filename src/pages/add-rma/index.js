import React, {Component} from "react";
import AddRMA from './AddRMA';
import {StackNavigator} from 'react-navigation';
import Barcode from '../Barcode';

export default (DrawNav = StackNavigator({
    AddRMA: {screen: AddRMA},
    Barcode: {screen: Barcode}
}));