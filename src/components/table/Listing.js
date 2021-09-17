/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import "./listing.css";

const captitionStyle = css`
  background: #ddd;
  padding: 10px;
  font-family: "Tahoma";
  font-weight: 700;
  font-size: 0.9em;
  color: hsl(237, 80%, 46%);
  width: auto;
`;

const tableCSS = css`
  width: 100%;
  box-sizing: border-box;
`;

const rowCSS = css`
  &:nth-of-type(even) {
    background-color: #d6eeee;
  }
  &:nth-of-type(odd) {
    background-color: #e8f0c7;
  }
`;

const headerCSS = css`
  font-family: "Tahoma";
  font-size: 0.8em;
  white-space: nowrap;
  > div:first-of-type {
    display: flex;
    > div {
      width: 90%;
    }
  }
  > div div span:first-of-type {
    user-select: none;
    margin: 3px 3px 3px 20px;
    &:first-of-type:hover {
      cursor: pointer;
    }
  }
  > div div span:last-of-type {
    margin-left: 5px;
  }
  > div svg {
    padding: 0px 3px 0px 3px;
    margin-left: auto;
  }
`;

const checkboxHeaderCSS = css`
  text-align: left;
  white-space: nowrap;
  width: 10px;
`;

function Listing({ items, name, sort }) {
  const [content, setContent] = useState([]);
  const [currentCol, setCurrentCol] = useState(-1);
  const [direction, setDirection] = useState(false);
  const [filter, setFilter] = useState("");
  const [filteredColumn, setFilteredColumn] = useState(false);
  const [checked, setChecked] = useState(0);

  const clearSorting = () => {
    const allHeaders = document.getElementsByClassName("sortable");
    Array.prototype.forEach.call(allHeaders, (element) => {
      const toRemove = ["arrow-up-active", "arrow-down-active"];
      element.classList.remove(...toRemove);
    });
  };

  const sortListing = (e) => {
    if (content.length <= 1) return;
    const header = e.target;
    const arrowIcon = header.nextSibling;
    clearSorting();
    const selectedColumn = parseInt(header.getAttribute("index"), 10);
    const key = Object.keys(content[0])[selectedColumn];
    setContent(sort(content, direction, key));

    if (currentCol === -1) {
      arrowIcon.classList.add("arrow-down-active");
    } else {
      if (direction) {
        // ascending
        arrowIcon.classList.remove("arrow-down");
        arrowIcon.classList.add("arrow-up");
        arrowIcon.classList.add("arrow-up-active");
      } else {
        // descending
        arrowIcon.classList.remove("arrow-up");
        arrowIcon.classList.add("arrow-down");
        arrowIcon.classList.add("arrow-down-active");
      }
    }
    setDirection(!direction);
    setCurrentCol(selectedColumn);
  };

  useEffect(() => {
    console.log("Listing rendering", content);
  });

  useEffect(() => {
    clearSorting();
    setContent(
      items.map((item) => {
        return { __meta__: { visible: true, checked: false }, ...item };
      })
    );
    if (items.length === 0) {
      setFilteredColumn(null);
      setChecked(0);
    }
  }, [items]);

  return (
    <>
      {/*** filtering ***/}
      {filteredColumn ? (
        <label
          style={{
            marginRight: "5px",
            fontFamily: "Tahoma",
            fontSize: "0.9em"
          }}
        >
          {filteredColumn}
          {": "}
          <input
            type="text"
            placeholder="filter"
            style={{ width: "300px", height: "20px" }}
            value={filter}
            onChange={(e) => {
              const newFilter = e.target.value;
              setFilter(newFilter);
              setContent(
                [...content].map((c) => {
                  if (c[filteredColumn].startsWith(newFilter)) {
                    c.__meta__.visible = true;
                  } else {
                    c.__meta__.visible = false;
                  }
                  return c;
                })
              );
            }}
            autoFocus
          ></input>
          <button
            onClick={() => {
              setFilter("");
              setContent(
                [...content].map((c) => {
                  c.__meta__.visible = true;
                  return c;
                })
              );
            }}
            style={{
              height: "15px",
              width: "10px",
              boxSizing: "content-box"
            }}
          >
            x
          </button>
        </label>
      ) : (
        false
      )}

      <table css={tableCSS}>
        <caption css={captitionStyle}>{name}</caption>
        <tbody>
          {/*** columns ***/}
          <tr key="0">
            {content && content[0] && (
              <th css={checkboxHeaderCSS}>
                <label style={{}}>
                  <input
                    type="checkbox"
                    onClick={(e) => {
                      if (e.target.checked) setChecked(content.length);
                      else setChecked(0);
                      setContent(
                        [...content].map((c) => {
                          c.__meta__.checked = e.target.checked;
                          return c;
                        })
                      );
                    }}
                  ></input>
                  <button style={checked > 0 ? {} : { display: "none" }}>
                    Remove
                  </button>
                </label>
              </th>
            )}
            {content && content[0] ? (
              Object.keys(content[0]).map((key, index) => {
                if (key === "__meta__") {
                  return false;
                }
                return (
                  <th key={key} css={headerCSS}>
                    <div>
                      <div>
                        <span index={index} onClick={sortListing}>
                          {key}
                        </span>
                        <span className="sortable arrow-down"></span>
                      </div>
                      <svg
                        onClick={(e) => {
                          setFilteredColumn(key);
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="blue"
                        stroke="blue"
                        strokeWidth="0.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-filter"
                      >
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                    </div>
                  </th>
                );
              })
            ) : (
              <th>[empty]</th>
            )}
          </tr>
          {/*** rows ***/}
          {content.map((item, index) => {
            return (
              <tr
                key={index}
                css={rowCSS}
                style={item.__meta__.visible ? {} : { display: "none" }}
              >
                <td style={{}}>
                  <label>
                    <input
                      type="checkbox"
                      onClick={(e) => {
                        if (e.target.checked) setChecked(checked + 1);
                        else setChecked(checked - 1);
                        item.__meta__.checked = e.target.checked;
                      }}
                      checked={item.__meta__.checked}
                    ></input>
                  </label>
                </td>
                {Object.values(item).map((v, i) => {
                  if (Object.keys(item)[i] === "__meta__") {
                    return false;
                  }
                  return <td key={i}>{v}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Listing;
