import React, {Component} from "react";
import ActivityReport from './ActivityReport';
import CampaignDetail from './CampaignDetail';
import ReportDetail from './ReportDetail';
import ItemDetail from './ItemDetail';
import {StackNavigator} from 'react-navigation';

export default (DrawNav = StackNavigator({
    ActivityReport: {screen: ActivityReport},
    CampaignDetail: {screen: CampaignDetail},
    ReportDetail: {screen: ReportDetail},
    ItemDetail: {screen: ItemDetail}
}));