/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { css } from "@emotion/react";

const base = css`
  color: black;
  font-weight: bold;
  background-color: lightgreen;
  border: 1px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
  margin: 5px 5px 5px 5px;
  height: 30px;
  width: 80px;
  &:disabled {
    box-shadow: none;
    background-color: lightgray;
  }
`;

function LoadingButton(props) {
  const { action, label, className } = props;
  if (action.constructor.name !== "AsyncFunction")
    throw new Error(`'action' prop must be an async function, ${action}`);

  const [disabled, setDisabled] = useState(false);

  // default style, can be customized via @classes prop
  const style = css`
    ${base}
    &:disabled {
      &:before {
        color: black;
        content: "loading";
      }
    }
  `;

  return (
    <button
      css={style}
      onClick={async () => {
        setDisabled(true);
        await action().catch((e) => {
          console.error(e);
          setDisabled(false);
        });
        setDisabled(false);
      }}
      disabled={disabled}
      className={className} // allow style overriding
    >
      {disabled ? false : label}
    </button>
  );
}

function SimpleButton(props) {
  const { action, label, className, disabled } = props;
  const [isDisabled, setIsDisabled] = useState(disabled);
  const style = css`
    ${base}
    &:disabled {
      color: black;
    }
  `;

  useEffect(() => {
    setIsDisabled(disabled);
  }, [disabled]);

  return (
    <button
      css={style}
      onClick={action}
      className={className} // allow style overriding
      disabled={isDisabled}
    >
      {label}
    </button>
  );
}

export { SimpleButton as default, LoadingButton };
