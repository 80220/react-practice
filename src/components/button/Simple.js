/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { css } from "@emotion/react";

// default style, can be customized via @classes prop
const style = css`
  color: red;
  font-weight: bold;
  background-color: lightgreen;
  border: 1px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
  margin: 5px 5px 5px 5px;
  height: 30px;
  width: 80px;
  &:disabled {
    background-color: lightgray;
    &:before {
      color: black;
      content: "loading";
    }
  }
`;

function SimpleButton(props) {
  const { action, content, className } = props;
  const [disabled, setDisabled] = useState(false);
  return (
    <button
      css={style}
      onClick={async () => {
        setDisabled(true);
        await action();
        setDisabled(false);
      }}
      disabled={disabled}
      className={className} // allow style overriding
    >
      {disabled ? "" : content}
    </button>
  );
}

export default SimpleButton;
