/** @jsxImportSource @emotion/react */
import { useEffect, useState, useCallback, useRef } from "react";
import { css } from "@emotion/react";
import Listing from "./components/table/Listing";
import SimpleButton, { LoadingButton } from "./components/button/Button";
import NumericInput from "./components/form/numericInput";

import axios from "axios";
import "./styles.css";

// override default styling of used components
const baseColorButtonCSS = css`
  color: rgb(48, 58, 194);
`;
const loadButtonCSS = css`
  ${baseColorButtonCSS}
  background-color: rgb(160, 189, 168);
`;
const reloadButtonCSS = css`
  ${baseColorButtonCSS}
  background-color: rgb(242, 245, 66);
`;
const moreButtonCSS = css`
  ${baseColorButtonCSS}
  background-color: hsl(321, 71%, 83%);
`;
const lessButtonCSS = css`
  ${baseColorButtonCSS}
  background-color: #b5f1f2;
`;
const clearButtonCSS = css`
  ${baseColorButtonCSS}
  background-color: lightcoral;
`;

export default function App() {
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(0);
  const [loadButtonDisabled, setLoadButtonDisabled] = useState(false);
  const inputLimit = useRef({ current: { value: 0 } });

  const fetch = useCallback(async (quantity) => {
    console.log("......Fetching.......", quantity, "spy(ies)");
    const URL = "https://randomuser.me/api/?results=" + quantity;
    const {
      data: { results }
    } = await axios.get(URL);
    console.log(results);
    const names = results.map((item) => {
      return {
        Title: item.name.title,
        FirstName: item.name.first,
        LastName: item.name.last,
        Gender: item.gender,
        Country: item.location.country,
        State: item.location.state,
        City: item.location.city,
        Phone: item.phone,
        Cell: item.cell
      };
    });
    return names;
  }, []);

  const load = useCallback(async () => {
    if (limit === 0) {
      return setItems([]);
    }
    const names = await fetch(limit);
    setItems(names);
  }, [fetch, limit]);

  const reload = async () => {
    const length = items.length.toString();
    if (length === "0") {
      return setItems([]);
    }
    const names = await fetch(length);
    setItems(names);
  };

  const clear = async () => {
    setItems([]);
    setLimit(0);
  };

  const less = () => {
    const step = 3;
    const copy = [...items];
    copy.splice(copy.length - step);
    setItems(copy);
  };

  const more = async () => {
    const step = 3;
    const names = await fetch(step);
    setItems(items.concat(names));
  };

  useEffect(() => {
    console.log("App initial render");
  }, []);

  useEffect(() => {
    console.log("initial fetch");
    load();
  }, [load]);

  useEffect(() => {
    console.log("App rendered, items", items);
    inputLimit.current.value = items.length.toString();
  }, [items, items.length]);

  const readLimit = (e) => {
    if (e.code === "Enter") {
      setLimit(e.target.value);
      setLoadButtonDisabled(true);
    }
  };

  const limitChanged = (e) => {
    console.log("limitChanged");
    if (e.target.value !== items.length.toString()) {
      setLoadButtonDisabled(false);
    } else {
      setLoadButtonDisabled(true);
    }
  };

  const sortItemsDefault = (content, direction, key) => {
    return [...content].sort((a, b) => {
      if (direction) {
        return a[key] < b[key] ? 1 : -1;
      } else {
        return a[key] > b[key] ? 1 : -1;
      }
    });
  };

  return (
    <div style={{}} className="App">
      <div className="container">
        <NumericInput
          value={inputLimit}
          label="Limit"
          limits={{ min: 0, max: 10 }}
          onKeyDown={readLimit}
          onChange={limitChanged}
        />
        <SimpleButton
          css={loadButtonCSS}
          action={() => {
            console.log("inputLimit.current.value", inputLimit.current.value);
            setLimit(parseInt(inputLimit.current.value, 10));
            setLoadButtonDisabled(true);
          }}
          label="load"
          disabled={loadButtonDisabled}
        />
        <LoadingButton css={reloadButtonCSS} action={reload} label="reload" />
        <LoadingButton
          css={moreButtonCSS}
          action={async () => {
            await more();
          }}
          label="more"
        />
        <LoadingButton css={lessButtonCSS} action={less} label="less" />
        <LoadingButton css={clearButtonCSS} action={clear} label="clear" />
      </div>
      <div>
        <Listing
          items={items}
          sort={sortItemsDefault}
          name="List of citizens"
        />
      </div>
    </div>
  );
}
