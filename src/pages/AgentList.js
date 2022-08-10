import React, {Component} from 'react';
import {
    Button,
    Header,
    Left,
    Body,
    Right,
    Title,
    ListItem,
    Text,
    Badge,
    Segment,
    ActionSheet
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import s from './Style';
import {connect} from 'react-redux';
import Loader from '../components/Loader';
import {
    ListView,
    View,
    Dimensions,
    Image,
    Linking,
    Platform,
    StyleSheet
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {bgHeader, bgContainer} from "../styles";
import {getRequest} from "../actions/Service";
import Config from 'react-native-config';

let {width} = Dimensions.get('window');


class AgentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: this._rowHasChanged.bind(this),
            }),
            dataSource: [],
            currentData: [],
            keyword: '',
            selectedAgentId: '',
            selectedAgentText: '',
            searchType: '',
            isSearched: false
        };
    }

    componentDidMount() {
        this.setState({searchType: this.props.navigation.getParam('search_type', '')});
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        this.setState({isSearched: true});
        if (nextProps.data != null) {
            if (nextProps.requestType == 'order_agent_list') {
                this.getUpdatedDataSource(nextProps.data);
            }
        }
    }

    getUpdatedDataSource(data) {
        console.log('get-updated-data-source');
        let agentList = data;
        for (let i = 0; i < agentList.length; i ++) {
            agentList[i].selected = false;
            agentList[i].text = agentList[i].first_name + ' ' + agentList[i].last_name + ' - ' + agentList[i].agent_id;
        }
        this.setState({dataSource: agentList});
        this.setState({currentData: agentList});
        this.setState({data: this.state.data.cloneWithRows(agentList)});
    }

    _rowHasChanged(r1, r2) {
        // You might want to use a different comparison mechanism for performance.
        return JSON.stringify(r1) !== JSON.stringify(r2);
    }

    searchByKeyword() {
        if (this.state.keyword == '') {
            this.getUpdatedDataSource([]);
        }else {
            this.props.getAgentList(this.state.searchType, this.state.keyword);
        }
    }

    resetData(rowId) {
        let rows = this.state.currentData.slice();
        for (let i = 0; i < rows.length; i ++) {
            rows[i].selected = false;
        }
        rows[rowId] = {
            ...this.state.currentData[rowId],
            selected: true,
        };
        this.setState({data: this.state.data.cloneWithRows(rows)});
    }

    renderRow(data, sectionId, rowId) {
        return (
            <ListItem button onPress={() => {
                console.log('select-list-item');
                this.setState({selectedAgentId: data.agent_id, selectedAgentText: data.text});
                this.props.navigation.state.params.onSelectAgent(data.agent_id, data.text);
                this.props.navigation.goBack();
                // this.props.navigation.setParams({
                //     agent_id: data.agent_id,
                //     agent_text: data.text
                // });
                // this.resetData(rowId);
            }}>
                <Body>
                {(() => {
                    if (data.company != '') {
                        return (
                            <Text>{data.first_name} {data.last_name} - {data.company}</Text>
                        )
                    }else {
                        return (
                            <Text>{data.first_name} {data.last_name}</Text>
                        )
                    }
                })()}
                 <Text note>{data.agent_id}</Text>
                </Body>
                <Right>
                    {(() => {
                        if (data.selected) {
                            console.log('selected-agent-id', data.agent_id);
                            return (
                                <Icon name="md-checkmark-circle-outline" style={{fontSize: 35}}/>
                            );
                        }
                    })()}
                </Right>
            </ListItem>
        );
    }


    render() {
        return (
            <View style={{ flex:1, backgroundColor: bgContainer }}>
                <Loader loading={this.props.isLoading}/>
                <Image style={{ width: width, height: width * 1263 / 2248, position: 'absolute', bottom:0, left:0 }} source={require('../imgs/background_1.png')} />
                <SearchBar
                    lightTheme
                    onChangeText={(text) => this.setState({keyword: text, isSearched: false})}
                    onClear={(text) => this.setState({keyword: '', isSearched: false})}
                    onEndEditing={() => this.searchByKeyword()}
                    value={this.state.keyword}
                    inputStyle={styles.searchBar}
                    autoFocus={true}
                    placeholder='Type Here...' />


                {(() => {
                    if (this.state.dataSource.length == 0) {
                        if (this.state.isSearched == true) {
                            return (
                                <Text style={{textAlign: 'center', marginTop: 50}}>There are no agents.</Text>
                            )
                        }else {
                            return (
                                <Text style={{textAlign: 'center', marginTop: 50}}>Please input the keyword and search.</Text>
                            )
                        }
                    } else {
                        return (
                            <ListView
                                dataSource={this.state.data}
                                renderRow={this.renderRow.bind(this)}
                            />
                        );
                    }
                })()}


            </View>
        )
    }
}

AgentList.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
                <Title style={{width: 200, color: '#fff'}}>Select Agent</Title>
            </Body>
            <Right>
                <Button transparent onPress={() => navigation.navigate("Home")}>
                    <Icon name="md-home" style={s.menuIcon}/>
                </Button>
            </Right>
        </Header>
    )
});

const styles = StyleSheet.create({
    searchBar: {
        ...Platform.select({
            android: {
                paddingTop: 10,
            },
        }),
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAgentList: (searchType, keyword) => {
            if (searchType == 'create_order') {
                dispatch(getRequest(Config.ORDER_AGENT_LIST_URL + '?keyword=' + keyword, 'order_agent_list'));
            }else {
                dispatch(getRequest(Config.TRANSFER_AGENT_LIST_URL + '?keyword=' + keyword, 'order_agent_list'));
            }
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AgentList);