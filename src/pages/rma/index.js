import React, {Component} from "react";
import RMAList from './RMAList';
import {StackNavigator} from 'react-navigation';

export default (DrawNav = StackNavigator({
    RMAList: {screen: RMAList},
}));