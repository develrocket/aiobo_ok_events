import React, {Component} from "react";
import EventList from './EventList';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent';
import ViewEvent from './ViewEvent';
import AddLocation from './AddLocation';
import PdfReader from './PdfReader';
import {StackNavigator} from 'react-navigation';

export default (DrawNav = StackNavigator({
    EventList: {screen: EventList},
    CreateEvent: {screen: CreateEvent},
    EditEvent: {screen: EditEvent},
    ViewEvent: {screen: ViewEvent},
    PdfReader: {screen: PdfReader},
    AddLocation: {screen: AddLocation}
}));