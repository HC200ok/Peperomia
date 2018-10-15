import React, { Component } from "react";
import {
  createStackNavigator,
  NavigationScreenProp,
  NavigationRoute
} from "react-navigation";
import Schedule from "../Schedule/Connected";
import ScheduleDetail from "../ScheduleDetail/Connected";
import Page, { Props as PageProps } from "./Page";

const data = [
  {
    id: "1",
    title: "葛西臨海公園",
    about: "新宿駅→葛西臨海公園→葛西臨海水上バス→浅草寺二天門前"
  },
  {
    id: "2",
    title: "市ヶ谷釣り堀",
    about: "市ヶ谷駅"
  },
  {
    id: "3",
    title: "横浜",
    about: "桜木町駅→山下公園→クルージング"
  }
];

interface Props extends PageProps {
  navigation: NavigationScreenProp<NavigationRoute>;
}

class HomeScreen extends Component<Props> {
  static navigationOptions = {
    title: "マイプラン"
  };

  onSchedule = (id: string) => {
    this.props.navigation.navigate("Schedule", { scheduleId: id });
  };

  render() {
    return <Page data={data} loading={false} onSchedule={this.onSchedule} />;
  }
}

const MainCardNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  },
  Schedule: {
    screen: Schedule
  }
});

export default createStackNavigator(
  {
    MainCardNavigator: {
      screen: MainCardNavigator
    },
    ScheduleDetail: {
      screen: ScheduleDetail
    }
  },
  {
    initialRouteName: "MainCardNavigator",
    mode: "modal",
    headerMode: "none"
  }
);