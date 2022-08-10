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
import {Col, Row, Grid} from 'react-native-easy-grid';

let {width} = Dimensions.get('window');


class BatchDetail extends Component {
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
            canLoadMoreContent: false,
            batchData: {}
        };
    }

    componentDidMount() {
        let batchData = this.props.navigation.getParam('batch_data', {});
        this.setState({isRendering: true, batchData: batchData});
        this.props.getStatementList(this.state.page_no, batchData.agent_id, batchData.batch_id);
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null && nextProps.requestType == 'batch_statement_list') {
            this.setState({data: this.getUpdatedDataSource(nextProps)});
            if (nextProps.data.length < 20) {
                this.setState({canLoadMoreContent: false})
            }else {
                this.setState({canLoadMoreContent: true})
            }
        }
    }

    getUpdatedDataSource(props) {
        let rows = this.state.dataSource.concat(props.data);
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
            this.props.getStatementList(this.state.page_no + 1, this.state.batchData.agent_id, this.state.batchData.batch_id);
            this.setState({page_no: this.state.page_no + 1});
        }
        // if (this.state.isFirstLoading) {
        //     this.setState({isFirstLoading: false});
        //     return;
        // }
        // this.setState({isRendering: false});
    };

    showStatementDetail(statement) {
        if (statement.type != '') {
            this.props.navigation.navigate('StatementDetail', {statement_data: statement});
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: bgContainer}}>
                <Image style={{width: width, height: width * 1263 / 2248, position: 'absolute', bottom: 0, left: 0}}
                       source={require('../../imgs/background_1.png')}/>
                <Loader loading={this.props.isLoading}/>

                {(() => {
                    if (this.state.batchData.amount) {
                        return (
                            <View style={{width: '100%', height: 60, marginTop: 20, marginBottom: 20, padding: 10}}>
                                <Grid style={{borderBottomWidth: 1, borderBottomColor: '#888888', paddingBottom: 10}}>
                                    <Col>
                                        <Text note>Batch ID</Text>
                                    </Col>
                                    <Col>
                                        <Text note>Amount</Text>
                                    </Col>
                                    <Col>
                                        <Text note>End Date</Text>
                                    </Col>
                                </Grid>
                                <Grid style={{marginTop: 10}}>
                                    <Col>
                                        <Text>{this.state.batchData.batch_id}</Text>
                                    </Col>
                                    <Col>
                                        <Text>{(this.state.batchData.amount * 1).toFixed(2)}</Text>
                                    </Col>
                                    <Col>
                                        <Text>{this.state.batchData.end_date}</Text>
                                    </Col>
                                </Grid>
                            </View>
                        )
                    }
                })()}

                <View style={{backgroundColor: '#c2ddff', paddingTop: 15, paddingLeft:15, paddingBottom: 15}}>
                    <Text>Statements List</Text>
                </View>

                {(() => {
                    if (this.state.dataSource.length == 0 && !this.props.isLoading) {
                        return (
                            <Text style={{textAlign: 'center', marginTop: 50}}>There are no statements.</Text>
                        );
                    } else {
                        return (
                            <ListView
                                dataSource={this.state.data}
                                renderRow={data => {
                                    return (
                                        <ListItem>
                                            <Body>
                                            <Text onPress={() => this.showStatementDetail(data)}>{data.statement_item}</Text>
                                            <Text note style={{fontSize: 10}} onPress={() => this.showStatementDetail(data)}>{data.description}</Text>
                                            </Body>
                                            <Right style={{flexDirection: 'row'}}>
                                                <Text style={{fontSize: 13}}
                                                      onPress={() => this.showStatementDetail(data)}>{(data.amount * 1).toFixed(2)}</Text>
                                                {(() => {
                                                    if (data.type != '') {
                                                        return (
                                                            <Icon name="ios-arrow-forward" style={s.itemDetailIcon} onPress={() => this.showBatchDetail(data)}/>
                                                        )
                                                    }
                                                })()}
                                            </Right>
                                        </ListItem>
                                    );
                                }}
                                onEndReachedThreshold={20}
                                onEndReached={this.loadMoreStatement.bind(this)}
                            />
                        );
                    }
                })()}


            </View>
        )
    }
}

BatchDetail.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Batch Detail</Title>
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
        getStatementList: (page_no, agent_id, batch_id) => {
            dispatch(getRequest(Config.TOTAL_BATCH_DETAIL_URL + '?page_no=' + page_no + '&agent_id=' + agent_id + '&batch_id=' + batch_id, 'batch_statement_list'));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BatchDetail);