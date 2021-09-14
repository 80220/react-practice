/** @jsxImportSource @emotion/react */
import { useEffect, useState, useCallback, useRef } from "react";
import { css } from "@emotion/react";
import Listing from "./components/table/Listing";
import ActionButton from "./components/button/Simple";

import axios from "axios";
import "./styles.css";

// override default styling of used componentents
const reloadButtonCSS = css`
  color: blue;
  background-color: rgb(242, 245, 66);
`;
const moreButtonCSS = css`
  color: blue;
  background-color: hsl(322, 71%, 83%);
`;
const deleteButtonCSS = css`
  color: blue;
  background-color: #b5f1f2;
`;
const clearButtonCSS = css`
  color: blue;
  background-color: lightcoral;
`;

export default function App() {
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(0);

  const inputLimit = useRef(null);
  const loadButton = useRef({ disabled: true });
  loadButton.current.disabled = true;

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

  const deleteSelected = () => {
    console.error("not implemented");
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
    }
  };

  const limitChanged = (e) => {
    console.log("limitChanged");
    if (e.target.value !== items.length.toString()) {
      loadButton.current.disabled = false;
    } else {
      loadButton.current.disabled = true;
    }
  };

  return (
    <div style={{}} className="App">
      <div className="container">
        <label
          style={{
            marginRight: "5px",
            fontFamily: "Tahoma",
            fontSize: "0.9em"
          }}
        >
          Limit:{" "}
          <input
            style={{}}
            ref={inputLimit}
            type="number"
            min={0}
            max={20}
            onKeyDown={readLimit}
            onChange={limitChanged}
            onMouseEnter={(e) => {
              inputLimit.current.focus();
            }}
          ></input>
          <button
            ref={loadButton}
            onClick={() => {
              setLimit(parseInt(inputLimit.current.value, 10));
              loadButton.current.disabled = true;
            }}
          >
            {" "}
            Load{" "}
          </button>
        </label>
        <ActionButton css={reloadButtonCSS} action={reload} content="reload" />
        <ActionButton
          css={moreButtonCSS}
          action={async () => {
            await more();
          }}
          content="more"
        />
        <ActionButton
          css={deleteButtonCSS}
          action={deleteSelected}
          content="delete"
        />
        <ActionButton css={clearButtonCSS} action={clear} content="clear" />
      </div>
      <div>
        <Listing items={items} name="List of citizens" />
      </div>
    </div>
  );
}
