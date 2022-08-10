/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import {AppRegistry, StatusBar, View, StyleSheet} from 'react-native';
import App from './src/app';
import {Provider} from 'react-redux';
import {store, persistor} from './src/store';
import {PersistGate} from 'redux-persist/integration/react';

export default class aiobo extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <View style={styles.container}>
                        <StatusBar
                            opaque
                            backgroundColor='rgba(0, 0, 0, 0.2)'
                            animated
                        />
                        <App/>
                    </View>
                </PersistGate>
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

