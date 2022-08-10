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
    Form,
    Item,
    Label,
    Input
} from 'native-base';
import {Image, Dimensions, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import s from '../Style';
import {connect} from 'react-redux';
import {bgHeader, bgContainer} from "../../styles";
import Communications from 'react-native-communications';

let {width} = Dimensions.get('window');

class AgentDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {}
        };
    }

    componentWillMount() {
        this.setState({data: this.props.navigation.getParam('order_data', 1)});
    }

    render() {
        return (
            <Container style={{backgroundColor: bgContainer}}>
                <Image style={{ width: width, height: width * 1263 / 2248, position: 'absolute', bottom:0, left:0 }} source={require('../../imgs/background_1.png')} />
                <Content padder>
                    {(() => {
                        if (Object.keys(this.state.data).length > 0) {
                            return (
                                <Form style={{marginBottom:20}}>
                                    <Item fixedLabel disabled>
                                        <Label>Invoice #:</Label>
                                        <Input disabled value={this.state.data.invmast_id} />
                                    </Item>
                                    <Item fixedLabel disabled>
                                        <Label>Issue to Agent: </Label>
                                        <Input disabled value={this.state.data.agent_xfer} />
                                    </Item>
                                    <Item fixedLabel disabled>
                                        <Label>Item: </Label>
                                        <Input disabled value={this.state.data.item} />
                                    </Item>
                                    <Item fixedLabel disabled>
                                        <Label>Quantity: </Label>
                                        <Input disabled value={this.state.data.quantity} />
                                    </Item>
                                    <Item fixedLabel disabled>
                                        <Label>Shipping Address: </Label>
                                        <Input disabled value={this.state.data.shipping_address} />
                                    </Item>
                                    <Item fixedLabel disabled>
                                        <Label>Add Date: </Label>
                                        <Input disabled value={this.state.data.add_date} />
                                    </Item>
                                    <Item fixedLabel disabled>
                                        <Label>Price: </Label>
                                        <Input disabled value={this.state.data.price} />
                                    </Item>
                                </Form>
                            )
                        }
                    })()}
                </Content>
            </Container>
        )
    }
}

AgentDetail.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 200, color: '#fff'}}>Order Detail</Title>
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


export default connect(mapStateToProps, mapDispatchToProps)(AgentDetail);