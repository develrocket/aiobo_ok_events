/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import {AppRegistry, StatusBar, View, StyleSheet} from 'react-native';
import App from './src/app';
import {Provider} from 'react-redux';
import {store} from './src/store';

export default class aiobo extends Component {
    render() {
        return (
            <Provider store={store}>
                <View style={styles.container}>
                    <StatusBar
                        opaque
                        backgroundColor='rgba(0, 0, 0, 0.2)'
                        animated
                    />
                    <App />
                </View>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
});


AppRegistry.registerComponent('aiobo', () => aiobo);
