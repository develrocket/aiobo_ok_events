import React, {Component} from "react";
import TotalBatch from './TotalBatch';
import BatchDetail from './BatchDetail';
import {StackNavigator} from 'react-navigation';
import StatementDetail from './StatementDetail';
import ItemDetail from './ItemDetail';

export default (DrawNav = StackNavigator({
    TotalBatch: {screen: TotalBatch},
    BatchDetail: {screen: BatchDetail},
    StatementDetail: {screen: StatementDetail},
    ItemDetail: {screen: ItemDetail}
}));