import React, { Fragment } from "react";
import { Image, TouchableOpacity } from "react-native";
import { View } from "react-native-ui-lib";
import styled from "styled-components/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  KIND_PARK,
  KIND_TRAIN,
  KIND_SHIP,
  KIND_DEFAULT
} from "../../../lib/getKind";
import { Text } from "../../atoms";

const park = require(`../../../img/park.png`);
const train = require(`../../../img/train.png`);
const ship = require(`../../../img/ship.png`);

const KINDS: any = {
  [KIND_PARK]: {
    image: "park",
    backgroundColor: "#77D353"
  },
  [KIND_TRAIN]: {
    image: "train",
    backgroundColor: "#F3B042"
  },
  [KIND_SHIP]: {
    image: "ship",
    backgroundColor: "#00A6FF"
  },
  [KIND_DEFAULT]: {
    image: null,
    backgroundColor: "#969FAA"
  }
};

export interface Props {
  id: string;
  kind: string;
  title: string;
  memo: string;
  onDismiss: () => void;
}

export default (props: Props) => {
  const config = KINDS[props.kind];

  const getImg = (kind: string) => {
    if (kind === KIND_PARK) {
      return park;
    } else if (kind === KIND_TRAIN) {
      return train;
    } else if (kind === KIND_SHIP) {
      return ship;
    }

    return null;
  };

  const img = getImg(props.kind);

  return (
    <Fragment>
      <View style={{ backgroundColor: config.backgroundColor }}>
        <View style={{ padding: 15, flexDirection: "row" }}>
          <TouchableOpacity onPress={props.onDismiss}>
            <MaterialCommunityIcons name="close" size={30} color="#ffffff" />
          </TouchableOpacity>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={30}
            color="#ffffff"
            style={{ marginRight: 0, marginLeft: "auto" }}
          />
        </View>

        <Content>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <View style={{ flex: 1, paddingLeft: 15, paddingBottom: 25 }}>
              <Title numberOfLines={1}>{props.title}</Title>
            </View>

            <View style={{ position: "absolute", right: 80 }}>
              {img ? <Image source={img} style={{ opacity: 0.5 }} /> : null}
            </View>
          </View>
        </Content>
      </View>
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 15, lineHeight: 18 }}>{props.memo}</Text>
      </View>
    </Fragment>
  );
};

const Content = styled.View`
  padding-horizontal: 0;
  padding-vertical: 0;
  border-radius: 0;
  height: 100;
  justify-content: flex-end;
`;

const Title = styled.Text`
  color: #ffffff;
  font-weight: 600;
  font-size: 20;
`;