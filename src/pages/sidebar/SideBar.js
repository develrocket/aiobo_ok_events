import React, {Component} from "react";
import {Container, Content, Text, List, ListItem, Left, Body} from "native-base";
import Icon from 'react-native-vector-icons/Ionicons';
import s from '../Style';
import {logout} from "../../actions/auth";
import {connect} from 'react-redux';

const routes = [
    {
        routeName: 'Home',
        name: "Home",
        icon: 'md-home'
    },
    {
        routeName: 'EventList',
        name: 'OK Events',
        icon: 'md-calendar'
    },
    {
        routeName: '',
        name: 'Sign Out',
        icon: 'md-log-out'
    }
];

class SideBar extends Component {
    constructor(props) {
        super(props);
        let newRoutes = routes;
        this.state = {
            routes: newRoutes
        };
    }


    remoteRoutes(routesArray, routeName) {
        let newRoutes = [];
        for (let i = 0; i < routesArray.length; i ++) {
            if (routesArray[i].routeName != routeName) {
                newRoutes.push(routesArray[i]);
            }
        }
        return newRoutes;
    }

    logout() {
        console.log('log-out');
        this.props.logout();
    }

    render() {
        return (
            <Container>
                <Content style={{backgroundColor: '#262626'}}>
                    <Text style={{marginTop: 30, color: '#fff', paddingLeft: 20}}>
                        Welcome
                    </Text>
                    <Text style={{textAlign: 'center', color: '#fff', fontSize: 25, marginTop: 10, marginBottom: 10}}>
                        <Icon name='md-person' style={{fontSize: 25}}/>&nbsp;&nbsp; {this.props.email}
                    </Text>
                    <List
                        style={{width: '100%'}}
                        dataArray={this.state.routes}
                        renderRow={data => {
                            return (
                                <ListItem
                                    icon
                                    onPress={() => {
                                        if (data.routeName) {
                                            this.props.navigation.navigate(data.routeName)
                                        } else {
                                            this.logout();
                                        }
                                    }}>
                                    <Left>
                                        <Icon name={data.icon} style={s.menuIcon}/>
                                    </Left>
                                    <Body>
                                    <Text style={{color: '#fff'}}>{data.name}</Text>
                                    </Body>
                                </ListItem>
                            );
                        }}
                    />
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        roles: state.auth.roles,
        email: state.auth.email
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => {
            dispatch(logout());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);