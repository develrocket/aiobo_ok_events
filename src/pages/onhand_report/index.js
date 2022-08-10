import React, {Component} from "react";
import OnHandReportList from './OnHandReportList';
import ReportByItem from './ReportByItem';
import ReportByItemDetail from './ReportByItemDetail';
import {StackNavigator} from 'react-navigation';

export default (DrawNav = StackNavigator({
    OnHandReportList: {screen: OnHandReportList},
    ReportByItem: {screen: ReportByItem},
    ReportByItemDetail: {screen: ReportByItemDetail},
}));