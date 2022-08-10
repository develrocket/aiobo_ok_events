import React, {Component} from 'react';
import {
    Button,
    Container,
    Content,
    Header,
    Left,
    Body,
    Right,
    Title,
    Text
} from 'native-base';
import {Image, Dimensions, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import s from '../Style';
import {connect} from 'react-redux';
import {bgHeader, bgContainer} from "../../styles";
import {Col, Row, Grid} from 'react-native-easy-grid';
import Loader from '../../components/Loader';
import {getRequest} from "../../actions/Service";
import Config from 'react-native-config';

let {width} = Dimensions.get('window');

class ItemDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            type: '',
            commissionData: {}
        };
    }

    componentWillMount() {
        let statementData = this.props.navigation.getParam('statement_data', {});
        let type = this.props.navigation.getParam('type', '');
        this.setState({data: statementData, type: type});
        if (type.indexOf('my_commission') >= 0) {
            this.props.getCommissionDetail(statementData.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('the state', nextProps);
        if (nextProps.data != null && nextProps.requestType == 'commission_detail') {
            this.setState({commissionData: nextProps.data});
        }
    }


    render() {
        let levels = [{
            key: 'level1',
            name: 'Level1'
        }, {
            key: 'level2',
            name: 'Level2'
        }, {
            key: 'level3',
            name: 'Level3'
        }, {
            key: 'level4',
            name: 'Level4'
        }, {
            key: 'level5',
            name: 'Level5'
        }];
        let credits = [{
            key: 'l1_credit',
            name: 'L1 Credit'
        },{
            key: 'l2_credit',
            name: 'L2 Credit'
        },{
            key: 'l3_credit',
            name: 'L3 Credit'
        },{
            key: 'l4_credit',
            name: 'L4 Credit'
        },{
            key: 'l5_credit',
            name: 'L5 Credit'
        }];
        let commissions = [{
            key: 'l1_commission',
            name: 'L1 Commission'
        }, {
            key: 'l2_commission',
            name: 'L2 Commission'
        },{
            key: 'l3_commission',
            name: 'L3 Commission'
        },{
            key: 'l4_commission',
            name: 'L4 Commission'
        },{
            key: 'l5_commission',
            name: 'L5 Commission'
        }];
        let numbers = [1, 2, 3, 4, 5];
        let index = 1;
        if (this.state.type.indexOf('my_credit') >= 0) {
            index = this.state.type.split('my_credit_l')[1] * 1;
        }else if (this.state.type.indexOf('my_commission') >= 0) {
            index = this.state.type.split('my_commission_l')[1] * 1;
        }

        let loops = numbers.slice(index - 1);

        return (
            <Container style={{backgroundColor: bgContainer}}>
                <Image style={{ width: width, height: width * 1263 / 2248, position: 'absolute', bottom:0, left:0 }} source={require('../../imgs/background_1.png')} />
                <Loader loading={this.props.isLoading}/>

                <Content padder>
                    {(() => {
                        if (this.state.type == 'my_invoices') {
                            return (
                                <View style={{width: '100%', paddingLeft: 15}}>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Item:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.data.item}</Text>
                                        </Col>
                                    </Grid>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Serial:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.data.serial}</Text>
                                        </Col>
                                    </Grid>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Quantity:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.data.quantity}</Text>
                                        </Col>
                                    </Grid>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Price:</Text>
                                        </Col>
                                        <Col>
                                            <Text>${(this.state.data.price * 1).toFixed(2)}</Text>
                                        </Col>
                                    </Grid>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Assigned Agent:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.data.assigned_agent}</Text>
                                        </Col>
                                    </Grid>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Due Date:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.data.due_date}</Text>
                                        </Col>
                                    </Grid>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Invoice Date:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.data.invoice_date}</Text>
                                        </Col>
                                    </Grid>
                                </View>
                            )
                        }else if (this.state.type.indexOf('my_credit') >= 0) {
                            return (
                                <View style={{width: '100%', paddingLeft: 15}}>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Order Number:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.data.order_number}</Text>
                                        </Col>
                                    </Grid>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Serial:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.data.serial}</Text>
                                        </Col>
                                    </Grid>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Device Type:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.data.device_type}</Text>
                                        </Col>
                                    </Grid>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Enroll Date:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.data.enroll_date}</Text>
                                        </Col>
                                    </Grid>

                                    {
                                        loops.map((loop_index, i) => (
                                            <Grid style={{height: 40}} key={i}>
                                                <Col style={{width: 120}}>
                                                    <Text
                                                        note>{loop_index == index ? 'Agent:' : levels[loop_index - 1].name + ':'}</Text>
                                                </Col>
                                                <Col>
                                                    <Text>{this.state.data[levels[loop_index - 1].key]}</Text>
                                                </Col>
                                            </Grid>
                                        ))
                                    }
                                    {

                                        loops.map((loop_index, i) => (
                                            <Grid style={{height: 40}} key={i}>
                                                <Col style={{width: 120}}>
                                                    <Text note>{loop_index == index ? 'Credit:' : credits[loop_index - 1].name + ':'}</Text>
                                                </Col>
                                                <Col>
                                                    <Text>{this.state.data[credits[loop_index - 1].key]}</Text>
                                                </Col>
                                            </Grid>
                                        ))
                                    }
                                </View>
                            )
                        }else if (this.state.type.indexOf('my_commission') >= 0 && typeof this.state.commissionData.campaign != 'undefined') {
                            return (
                                <View style={{width: '100%', paddingLeft: 15}}>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Campaign:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.commissionData.campaign}</Text>
                                        </Col>
                                    </Grid>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Order Number:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.commissionData.order_number}</Text>
                                        </Col>
                                    </Grid>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Dealer Code:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.commissionData.dealercode}</Text>
                                        </Col>
                                    </Grid>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Created Date:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.commissionData.created_date}</Text>
                                        </Col>
                                    </Grid>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Approved Date:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.commissionData.approved_date}</Text>
                                        </Col>
                                    </Grid>
                                    <Grid style={{height: 40}}>
                                        <Col style={{width: 120}}>
                                            <Text note>Device:</Text>
                                        </Col>
                                        <Col>
                                            <Text>{this.state.commissionData.device}</Text>
                                        </Col>
                                    </Grid>

                                    {
                                        loops.map((loop_index, i) => (
                                            <Grid style={{height: 40}} key={i}>
                                                <Col style={{width: 120}}>
                                                    <Text note>{loop_index == index ? 'Agent:' : levels[loop_index - 1].name + ':'}</Text>
                                                </Col>
                                                <Col>
                                                    <Text>{this.state.commissionData[levels[loop_index - 1].key]}</Text>
                                                </Col>
                                            </Grid>
                                        ))
                                    }

                                    {
                                        loops.map((loop_index, i) => (
                                            <Grid style={{height: 40}} key={i}>
                                                <Col style={{width: 120}}>
                                                    <Text note>{loop_index == index ? 'Commission:' : commissions[loop_index - 1].name + ':'}</Text>
                                                </Col>
                                                <Col>
                                                    <Text>{this.state.commissionData[commissions[loop_index - 1].key]}</Text>
                                                </Col>
                                            </Grid>
                                        ))
                                    }
                                </View>
                            )
                        }
                    })()}
                </Content>
            </Container>
        )
    }
}

ItemDetail.navigationOptions = ({navigation}) => ({
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
        getCommissionDetail(itemId) {
            dispatch(getRequest(Config.BATCH_COMMISSION_DETAIL_URL + itemId, 'commission_detail'));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(ItemDetail);