import React, {Component} from "react";
import AgentList from './Agent';
import AgentDownList from './AgentDown';
import AgentDetail from './AgentDetail';
import PendingAgentEdit from './PendingAgentEdit';
import {StackNavigator} from 'react-navigation';

export default (DrawNav = StackNavigator({
    Agent: {screen: AgentList},
    AgentDetail: {screen: AgentDetail},
    AgentDown: {screen: AgentDownList},
    PendingAgentEdit: {screen: PendingAgentEdit}
}));