import React, { Fragment } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text } from "react-native-ui-lib";
import Card from "./Card";

export interface ItemProps {
  id: string;
  kind: string;
  title: string;
  moveMinutes: number | null;
  end: boolean;
}

export interface Props extends ItemProps {
  onPress: () => void;
}

export default (props: Props) => {
  return (
    <Fragment>
      <TouchableOpacity onPress={props.onPress}>
        <Card {...props} />
      </TouchableOpacity>
      {(() => {
        if (props.end) {
          return null;
        }

        return (
          <View style={{ padding: 15 }}>
            <Text text25 style={{ fontWeight: "600" }}>
              {props.moveMinutes ? `${props.moveMinutes}分` : "-"}
            </Text>
          </View>
        );
      })()}
    </Fragment>
  );
};
