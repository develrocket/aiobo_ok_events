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
    ActionSheet,
    Card,
    CardItem
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import s from '../Style';
import Config from 'react-native-config';
import {connect} from 'react-redux';
import Loader from '../../components/Loader';
import {getRequest} from "../../actions/Service";
import {
    ListView,
    View,
    Dimensions,
    Image,
} from 'react-native';
import {bgHeader, bgContainer} from "../../styles";

let {width} = Dimensions.get('window');


class StatementDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: this._rowHasChanged.bind(this),
            }),
            dataSource: [],
            isRendering: true,
            isFirstLoading: true,
            page_no: 1,
            total_count: 0,
            canLoadMoreContent: false,
            statementData: {}
        };
    }

    componentDidMount() {
        let statementData = this.props.navigation.getParam('statement_data', {});
        this.setState({isRendering: true, statementData: statementData});
        this.props.getItemList(this.state.page_no, statementData.agent_id, statementData.batch_id, statementData.statement_item_id, statementData.type);
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null && nextProps.requestType == 'statement_statement_list') {
            this.setState({data: this.getUpdatedDataSource(nextProps), total_count: nextProps.data['count']});
            if (nextProps.data.statements.length < 20) {
                this.setState({canLoadMoreContent: false})
            }else {
                this.setState({canLoadMoreContent: true})
            }
        }
    }

    getUpdatedDataSource(props) {
        let rows = this.state.dataSource.concat(props.data['statements']);
        this.setState({dataSource: rows});
        let ids = rows.map((obj, index) => index);
        return this.state.data.cloneWithRows(rows, ids);
    }

    _rowHasChanged(r1, r2) {
        // You might want to use a different comparison mechanism for performance.
        return JSON.stringify(r1) !== JSON.stringify(r2);
    }

    loadMoreStatement = async () => {
        if (this.state.canLoadMoreContent) {
            this.props.getItemList(this.state.page_no + 1, this.state.statementData.agent_id, this.state.statementData.batch_id, this.state.statementData.statement_item_id, this.state.statementData.type);
            this.setState({page_no: this.state.page_no + 1});
        }
        // if (this.state.isFirstLoading) {
        //     this.setState({isFirstLoading: false});
        //     return;
        // }
        // this.setState({isRendering: false});
    };

    showStatementDetail(statement) {
        this.props.navigation.navigate('ItemDetail', {statement_data: statement, type: this.state.statementData.type});
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: bgContainer}}>
                <Image style={{width: width, height: width * 1263 / 2248, position: 'absolute', bottom: 0, left: 0}}
                       source={require('../../imgs/background_1.png')}/>
                <Loader loading={this.props.isLoading}/>

                {(() => {
                    if (this.state.dataSource.length == 0 && !this.props.isLoading) {
                        return (
                            <Text style={{textAlign: 'center', marginTop: 50}}>There are no statements.</Text>
                        );
                    } else {
                        return (
                            <View>
                                <ListItem style={{marginLeft: 0, paddingRight: 0}}>
                                    <Card>
                                        <CardItem>
                                            <Body>
                                            <Text style={{marginTop: 3}}>Total Counts</Text>
                                            </Body>
                                            <Right style={{flexDirection: 'row', height: 28}}>
                                                <Badge style={{backgroundColor: bgHeader, position:'absolute', right: 20, top: 1}}>
                                                    <Text style={{fontSize: 13}}>{this.state.total_count}</Text>
                                                </Badge>
                                            </Right>
                                        </CardItem>
                                    </Card>
                                </ListItem>

                                <ListView
                                    dataSource={this.state.data}
                                    renderRow={data => {
                                        if (this.state.statementData.type == 'my_invoices') {
                                            return (
                                                <ListItem>
                                                    <Body>
                                                    <Text onPress={() => this.showStatementDetail(data)}>{data.item}</Text>
                                                    <Text note style={{fontSize: 10}} onPress={() => this.showStatementDetail(data)}>Serial: {data.serial}</Text>
                                                    </Body>
                                                    <Right style={{flexDirection: 'row'}}>
                                                        <Text style={{fontSize: 13}}
                                                              onPress={() => this.showStatementDetail(data)}>${(data.price * 1).toFixed(2)}</Text>
                                                        <Icon name="ios-arrow-forward" style={s.itemDetailIcon} onPress={() => this.showBatchDetail(data)}/>
                                                    </Right>
                                                </ListItem>
                                            );
                                        }else if (this.state.statementData.type.indexOf('my_credit') >= 0) {
                                            return (
                                                <ListItem>
                                                    <Body>
                                                    <Text onPress={() => this.showStatementDetail(data)}>{data.order_number}</Text>
                                                    <Text note style={{fontSize: 10}} onPress={() => this.showStatementDetail(data)}>Serial: {data.serial}</Text>
                                                    <Text note style={{fontSize: 10}} onPress={() => this.showStatementDetail(data)}>Enroll Date: {data.enroll_date}</Text>
                                                    </Body>
                                                    <Right style={{flexDirection: 'row'}}>
                                                        <Icon name="ios-arrow-forward" style={s.itemDetailIcon} onPress={() => this.showBatchDetail(data)}/>
                                                    </Right>
                                                </ListItem>
                                            )
                                        }else if (this.state.statementData.type.indexOf('my_commission') >= 0) {
                                            return (
                                                <ListItem>
                                                    <Body>
                                                    <Text onPress={() => this.showStatementDetail(data)}>{data.agent}</Text>
                                                    <Text note style={{fontSize: 10}} onPress={() => this.showStatementDetail(data)}>Device: {data.device}</Text>
                                                    <Text note style={{fontSize: 10}} onPress={() => this.showStatementDetail(data)}>Status: {data.status}</Text>
                                                    </Body>
                                                    <Right style={{flexDirection: 'row'}}>
                                                        <Icon name="ios-arrow-forward" style={s.itemDetailIcon} onPress={() => this.showBatchDetail(data)}/>
                                                    </Right>
                                                </ListItem>
                                            )
                                        }
                                    }}
                                    onEndReachedThreshold={20}
                                    onEndReached={this.loadMoreStatement.bind(this)}
                                />
                            </View>
                        );
                    }
                })()}


            </View>
        )
    }
}

StatementDetail.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Statement Detail</Title>
            </Body>
            <Right>
                <Button transparent onPress={() => navigation.navigate("Home")}>
                    <Icon name="md-home" style={s.menuIcon}/>
                </Button>
            </Right>
        </Header>
    )
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
        getItemList: (page_no, agent_id, batch_id, statement_item_id, type) => {
            dispatch(getRequest(Config.STATEMENT_DETAIL_URL + '?page_no=' + page_no + '&agent_id=' + agent_id + '&batch_id=' + batch_id + '&statement_item_id=' + statement_item_id + '&type=' + type, 'statement_statement_list'));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(StatementDetail);