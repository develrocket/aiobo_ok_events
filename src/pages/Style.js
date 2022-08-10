import {StyleSheet, Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const styles = StyleSheet.flatten({
    menuIcon: {
        color: '#ffffff',
        fontSize: 20
    },
    header: {
        paddingTop: getStatusBarHeight(),
        height: 54 + getStatusBarHeight()
    },
    menuHeader: {
        backgroundColor: '#2f89d7',
        ...Platform.select({
            ios: {
                paddingTop: 30,
                height: 70
            }
        })
    },
    itemDetailIcon: {
        fontSize: 20,
        position: 'absolute',
        right: 5
    }
});

export default styles;