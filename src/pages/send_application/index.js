import React, {Component} from "react";
import SendApplication from './SendApplication';
import {StackNavigator} from 'react-navigation';

export default (DrawNav = StackNavigator({
    SendApplication: {screen: SendApplication},
}));