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

let {width} = Dimensions.get('window');

class ItemDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            type: ''
        };
    }

    componentWillMount() {
        let reportData = this.props.navigation.getParam('report_data', {});
        this.setState({data: reportData});
    }


    render() {

        return (
            <Container style={{backgroundColor: bgContainer}}>
                <Image style={{ width: width, height: width * 1263 / 2248, position: 'absolute', bottom:0, left:0 }} source={require('../../imgs/background_1.png')} />
                <Content padder>
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
                                <Text note>Date:</Text>
                            </Col>
                            <Col>
                                <Text>{this.state.data.date}</Text>
                            </Col>
                        </Grid>
                        <Grid style={{height: 40}}>
                            <Col style={{width: 120}}>
                                <Text note>Dealer Code:</Text>
                            </Col>
                            <Col>
                                <Text>{this.state.data.dealercode}</Text>
                            </Col>
                        </Grid>
                        <Grid style={{height: 40}}>
                            <Col style={{width: 120}}>
                                <Text note>Status:</Text>
                            </Col>
                            <Col>
                                <Text>{this.state.data.status}</Text>
                            </Col>
                        </Grid>
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
                    </View>
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
            <Title style={{width: 200, color: '#fff'}}>Report Detail</Title>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(ItemDetail);