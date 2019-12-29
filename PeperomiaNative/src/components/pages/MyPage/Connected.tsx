import React, { Component } from 'react';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { Alert, Dimensions } from 'react-native';
import Toast from 'react-native-root-toast';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import 'dayjs/locale/ja';
import { backup, restore } from '../../../lib/backup';
import theme from '../../../config/theme';
import {
  Consumer as FetchConsumer,
  ContextProps as FetchContextProps,
} from '../../../containers/Fetch';
import {
  Consumer as AuthConsumer,
  ContextProps as AuthContextProps,
} from '../../../containers/Auth';
import {
  Consumer as ItemsConsumer,
  ContextProps as ItemsContextProps,
} from '../../../containers/Items';
import Page from './Page';

dayjs.extend(advancedFormat);

type Props = {
  navigation: NavigationScreenProp<NavigationRoute>;
};

export default class extends Component<Props> {
  static navigationOptions = () => {
    return {
      title: 'マイページ',
      headerBackTitle: '',
      headerTitleStyle: {
        color: theme().mode.header.text,
      },
      headerTintColor: theme().mode.header.text,
      headerStyle: {
        backgroundColor: theme().mode.header.backgroundColor,
      },
    };
  };

  render() {
    return (
      <AuthConsumer>
        {({ email, uid }: AuthContextProps) => (
          <FetchConsumer>
            {({ post }: FetchContextProps) => (
              <ItemsConsumer>
                {({ refreshData }: ItemsContextProps) => (
                  <Connected
                    {...this.props}
                    post={post}
                    email={email}
                    uid={uid}
                    refreshData={refreshData}
                  />
                )}
              </ItemsConsumer>
            )}
          </FetchConsumer>
        )}
      </AuthConsumer>
    );
  }
}

type ConnectedProps = Pick<ItemsContextProps, 'refreshData'> &
  Pick<AuthContextProps, 'uid' | 'email'> &
  Pick<FetchContextProps, 'post'> & {
    navigation: NavigationScreenProp<NavigationRoute>;
  };

type State = {
  loading: boolean;
  LoadingText: string;
};

class Connected extends Component<ConnectedProps, State> {
  state = {
    loading: false,
    LoadingText: '',
  };

  onBackup = async () => {
    Alert.alert(
      'バックアップを作成しますか？',
      '既にバックアップを作成している場合は上書きされます。',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '作成する',
          onPress: () => {
            this.backup();
          },
        },
      ],
      { cancelable: false }
    );
  };

  backup = async () => {
    if (!this.props.post) {
      return;
    }

    this.setState({
      loading: true,
      LoadingText: 'バックアップ中です...',
    });

    try {
      const { items, itemDetails, calendars } = await backup();

      const request = {
        items,
        itemDetails,
        calendars: calendars.map(calendar => ({
          ...calendar,
          date: dayjs(calendar.date).format(),
        })),
      };
      const response = await this.props.post('SyncItems', {
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        Alert.alert('バックアップに失敗しました');
        this.setState({
          loading: false,
        });
        return;
      }

      const { height } = Dimensions.get('window');

      let toast = Toast.show('バックアップを作成しました', {
        duration: Toast.durations.LONG,
        position: height - 150,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });

      // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
      setTimeout(function() {
        Toast.hide(toast);
      }, 3000);

      this.setState({
        loading: false,
      });
    } catch (err) {
      this.setState({
        loading: false,
      });

      setTimeout(() => {
        Alert.alert('バックアップに失敗しました');
      }, 100);
    }
  };

  onRestore = async () => {
    Alert.alert(
      'バックアップから復元しますか？',
      '現在のデータは削除されるのでご注意ください',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '復元する',
          onPress: () => {
            this.restore();
          },
        },
      ],
      { cancelable: false }
    );
  };

  restore = async () => {
    if (!this.props.uid) {
      return;
    }

    this.setState({
      loading: true,
      LoadingText: '復元中です...',
    });

    try {
      await restore(this.props.uid);

      const { height } = Dimensions.get('window');

      let toast = Toast.show('データを復元しました', {
        duration: Toast.durations.LONG,
        position: height - 150,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });

      // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
      setTimeout(function() {
        Toast.hide(toast);
      }, 3000);

      if (this.props.refreshData) {
        await this.props.refreshData();
      }

      this.setState({
        loading: false,
      });
    } catch (err) {
      this.setState({
        loading: false,
      });

      setTimeout(() => {
        Alert.alert('復元に失敗しました', err.message);
      }, 100);
    }
  };

  render() {
    return (
      <Page
        loading={this.state.loading}
        LoadingText={this.state.LoadingText}
        email={this.props.email || ''}
        onBackup={this.onBackup}
        onRestore={this.onRestore}
      />
    );
  }
}
