import React, {Component} from "react";
import OrderList from './OrderList';
import OrderDetail from './OrderDetail';
import {StackNavigator} from 'react-navigation';

export default (DrawNav = StackNavigator({
    OrderList: {screen: OrderList},
    OrderDetail: {screen: OrderDetail}
}));