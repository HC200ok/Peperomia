import React from "react";
import { Image, View } from "react-native";
import {
  KIND_PARK,
  KIND_TRAIN,
  KIND_SHIP,
  KIND_FISHING
} from "../../lib/getKind";

const park = require(`../../img/park@2x.png`);
const train = require(`../../img/train@2x.png`);
const ship = require(`../../img/ship@2x.png`);
const fishing = require(`../../img/fishing@2x.png`);
const world = require(`../../img/world@2x.png`);

export interface Props {
  kind: string;
  size: number;
  opacity?: number;
  image?: string;
  defaultIcon?: boolean;
}

const getImg = (kind: string, defaultIcon?: boolean) => {
  if (kind === KIND_PARK) {
    return park;
  } else if (kind === KIND_TRAIN) {
    return train;
  } else if (kind === KIND_SHIP) {
    return ship;
  } else if (kind === KIND_FISHING) {
    return fishing;
  }

  if (defaultIcon) {
    return world;
  }

  return null;
};

export default (props: Props) => {
  if (props.image) {
    return (
      <Frame size={props.size}>
        <Image
          source={{
            uri: `data:image/png;base64,${props.image}`
          }}
          style={{
            opacity: props.opacity || 0.5,
            width: "100%",
            height: "100%"
          }}
        />
      </Frame>
    );
  }

  const img = getImg(props.kind, props.defaultIcon);

  return (
    <Frame size={props.size}>
      <Image
        source={img}
        style={{
          opacity: props.opacity || 0.5,
          width: "100%",
          height: "100%"
        }}
      />
    </Frame>
  );
};

export interface Frame {
  children: any;
  size: number;
}

const Frame = (props: Frame) => (
  <View
    style={{
      width: props.size,
      height: props.size
    }}
  >
    {props.children}
  </View>
);
