import React from "react";
import Color from "color";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ItemDetail } from "../../../lib/item";
import { IconImage } from "primitive";

import { KINDS } from "../../../lib/getKind";
import s from "../../../config/style";

interface Props extends ItemDetail {
  last: boolean;
}

export default (props: Props) => {
  const config = KINDS[props.kind];
  const ss = s.schedule;

  if (!config) {
    return null;
  }

  let panelProps = {};

  if (props.memo === "") {
    panelProps = {
      expanded: false
    };
  }
  return (
    <>
      <ExpansionPanel
        style={{
          borderRadius: 0,
          borderWidth: ss.borderWidth,
          borderColor: Color(config.backgroundColor)
            .lighten(ss.backgroundColorAlpha)
            .toString(),
          backgroundColor: Color(config.backgroundColor)
            .lighten(ss.borderColorAlpha)
            .toString()
        }}
        {...panelProps}
      >
        <ExpansionPanelSummary
          expandIcon={
            props.memo !== "" ? (
              <ExpandMoreIcon style={{ color: "#999" }} />
            ) : null
          }
        >
          <Typography>{props.title}</Typography>
          <div
            style={{ position: "absolute", top: 2, right: 50, opacity: 0.9 }}
          >
            <IconImage src={config.src} name={config.name} size={45} />
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Box fontSize={12}>
            {(props.memo || "").split("\n").map((m, index) => (
              <span key={index}>
                {m}
                <br />
              </span>
            ))}
          </Box>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {!props.last && (
        <div style={{ padding: 5, paddingLeft: 25, fontSize: "11px" }}>
          {props.moveMinutes ? props.moveMinutes + "分" : "-"}
        </div>
      )}
    </>
  );
};