/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { css } from "@emotion/react";

const labelCSS = css`
  font-family: Tahoma;
  font-size: 0.8em;
  font-weight: 600;
  color: rgb(39, 79, 50);
`;
const inputCSS = css`
  border: 2px solid black;
  border-radius: 5px;
`;

function NumericInput(props) {
  const { value, label, limits } = props;
  const { onKeyDown, onChange } = props;

  useEffect(() => {
    console.log("rendering NumericInput");
  });

  return (
    <label css={labelCSS}>
      {label}:{" "}
      <input
        css={inputCSS}
        ref={value}
        type="number"
        min={limits.min}
        max={limits.max}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onMouseEnter={() => {
          value.current.focus();
        }}
        autoFocus
      ></input>
    </label>
  );
}

export default NumericInput;
