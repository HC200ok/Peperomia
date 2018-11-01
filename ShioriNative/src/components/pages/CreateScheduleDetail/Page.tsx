import React, { Component } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text as TextPlan
} from "react-native";
import {
  ActionSheetProps,
  connectActionSheet
} from "@expo/react-native-action-sheet";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Header from "../../molecules/ScheduleHeader/Header";
import { Text } from "../../atoms";

export interface Props {
  title: string;
  memo: string;
  time: number;
  onDismiss: () => void;
}

const times = [
  {
    value: 0,
    label: "0分"
  },
  {
    value: 10,
    label: " 10分"
  },
  {
    value: 30,
    label: " 30分"
  },
  {
    value: 60,
    label: " 60分"
  },
  {
    value: null,
    label: "手動で更新"
  },
  {
    value: null,
    label: "キャンセル"
  }
];

const cancelButtonIndex = times.length - 1;
const manualButtonIndex = times.length - 2;

class App extends Component<Props & ActionSheetProps> {
  state = {
    title: this.props.title,
    memo: this.props.memo,
    time: this.props.time
  };
  onOpenActionSheet = () => {
    const options = times.map(val => val.label);

    let destructiveButtonIndex = times.findIndex(
      val => this.state.time === val.value
    );
    if (destructiveButtonIndex === null) {
      destructiveButtonIndex = manualButtonIndex;
    }

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex
      },
      buttonIndex => {
        // Do something here depending on the button index selected
        if (buttonIndex == cancelButtonIndex) {
          return;
        }

        if (buttonIndex == manualButtonIndex) {
          return;
        }

        this.setState({ time: times[buttonIndex].value });
      }
    );
  };
  render() {
    return (
      <View
        style={{ backgroundColor: "#ffffff", height: "100%", width: "100%" }}
      >
        <Header
          kind="train"
          right={
            <Text style={{ fontSize: 18, fontWeight: "500", color: "#ffffff" }}>
              保存
            </Text>
          }
          onClose={this.props.onDismiss}
        >
          <TextInput
            placeholder="タイトルを入力"
            placeholderTextColor="#ffffff"
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: "#ffffff",
              paddingLeft: 1
            }}
            onChangeText={title => this.setState({ title })}
          />
        </Header>
        <View style={{ padding: 20 }}>
          <TouchableOpacity onPress={this.onOpenActionSheet}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 0.5,
                borderColor: "#5A6978",
                width: 80,
                height: 30
              }}
            >
              <Ionicons
                name="md-time"
                color="#5A6978"
                size={24}
                style={{ paddingTop: 3 }}
              />
              <TextPlan
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: "#00A6FF",
                  paddingHorizontal: 15
                }}
              >
                {this.state.time}分
              </TextPlan>
            </View>
          </TouchableOpacity>
          <View style={{ paddingTop: 30 }}>
            <MaterialIcons name="edit" color="#00A6FF" size={25} />
            <View style={{ paddingTop: 5 }}>
              <TextInput
                placeholder="メモを書く"
                multiline
                style={{
                  fontSize: 16,
                  lineHeight: 24,
                  fontWeight: "400",
                  borderBottomWidth: 0.5,
                  borderColor: "#5A6978"
                }}
                onChangeText={memo => {
                  this.setState({ memo });
                }}
              >
                <TextPlan
                  style={{ fontSize: 16, lineHeight: 24, fontWeight: "400" }}
                >
                  {this.state.memo}
                </TextPlan>
              </TextInput>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default connectActionSheet(App);