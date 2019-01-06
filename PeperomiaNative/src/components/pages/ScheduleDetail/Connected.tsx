import { SQLite } from "expo";
import React, { Component } from "react";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import uuidv1 from "uuid/v1";
import { db } from "../../../lib/db";
import { Item, select1st as selectItem1st } from "../../../lib/db/item";
import {
  ItemDetail,
  select1st,
  delete1st,
  selectByItemId,
  sortItemDetail
} from "../../../lib/db/itemDetail";
import Page from "./Page";

interface State {
  item: Item;
  itemDetail: ItemDetail;
}

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
  onEdit: (title: string, memo: string, moveMinutes: number) => void;
}

export default class extends Component<Props, State> {
  state = {
    item: { id: 0, title: "", image: "" },
    itemDetail: {
      id: 0,
      itemId: 0,
      kind: "",
      title: "",
      memo: "",
      moveMinutes: 0,
      priority: 0
    }
  };

  componentDidMount() {
    const scheduleDetailId = this.props.navigation.getParam(
      "scheduleDetailId",
      "1"
    );
    db.transaction((tx: SQLite.Transaction) => {
      select1st(tx, scheduleDetailId, (data: any, error: any) => {
        if (error) {
          return;
        }
        this.setState({ itemDetail: data });
        selectItem1st(tx, String(this.state.itemDetail.itemId), this.setItem);
      });
    });
  }

  setItem = (data: any, error: any) => {
    if (error) {
      return;
    }

    this.setState({ item: data });
  };

  onDismiss = () => {
    this.props.navigation.goBack();
  };

  onCreateScheduleDetail = () => {
    const { title, memo, moveMinutes } = this.state.itemDetail;
    this.props.onEdit(title, memo, moveMinutes);
  };

  onDelete = () => {
    db.transaction((tx: SQLite.Transaction) => {
      delete1st(
        tx,
        String(this.state.itemDetail.id),
        (data: any, error: any) => {
          if (error) {
            return;
          }
          selectByItemId(
            tx,
            String(this.state.itemDetail.itemId),
            (itemDetails: any, error: any) => {
              sortItemDetail(tx, itemDetails, this.onPushSchedule);
            }
          );
        }
      );
    });
  };

  onPushSchedule = (data: any, error: any) => {
    if (error) {
      return;
    }

    this.props.navigation.navigate("Schedule", {
      itemId: this.state.itemDetail.itemId,
      title: this.state.item.title,
      refresh: uuidv1()
    });
  };

  render() {
    if (this.state.itemDetail.id === 0) {
      return null;
    }
    return (
      <Page
        {...this.state.itemDetail}
        onDismiss={this.onDismiss}
        onDelete={this.onDelete}
        onCreateScheduleDetail={this.onCreateScheduleDetail.bind(this)}
      />
    );
  }
}