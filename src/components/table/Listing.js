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
  /* border-top: 1px solid black;
  border-left: 1px solid black;
  border-right: 1px solid black; */
`;

// const containerStyle = css`
//   border: 1px solid black;
//   margin-top: 10px;
//   width: 100%;
// `;

const tableCSS = css`
  width: 100%;
  /* border: 1px solid black; */
  box-sizing: border-box;
  /* margin: 5px; */
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
  /* font-weight: 500; */
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

function Listing({ items, name }) {
  const [content, setContent] = useState(items);
  const [currentCol, setCurrentCol] = useState(-1);
  const [direction, setDirection] = useState(false);
  const [filter, setFilter] = useState("");
  const [filteredColumn, setFilteredColumn] = useState(false);

  const clearSelection = () => {
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
    clearSelection();
    const selectedColumn = parseInt(header.getAttribute("index"), 10);
    const key = Object.keys(content[0])[selectedColumn];
    const res = [...content].sort((a, b) => {
      if (direction) {
        return a[key] < b[key] ? 1 : -1;
      } else {
        return a[key] > b[key] ? 1 : -1;
      }
    });
    setContent(res);

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
    clearSelection();
    setContent(items);
    if (items.length === 0) {
      setFilteredColumn(null);
    }
  }, [items]);

  return (
    <>
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
              setFilter(e.target.value);
            }}
          ></input>
          <button
            onClick={() => {
              setFilter("");
            }}
            style={{ height: "26px" }}
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
          <tr key="0">
            {content[0] && (
              <th style={{ textAlign: "left" }}>
                <label>
                  <input type="checkbox"></input>
                </label>
              </th>
            )}
            {content[0] ? (
              Object.keys(content[0]).map((key, index) => {
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
                        // style={{ marginLeft: "15px" }}
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

          {content.map((item, index) => {
            return (
              <tr key={index} css={rowCSS}>
                <td>
                  <label>
                    <input type="checkbox"></input>
                  </label>
                </td>
                {Object.values(item).map((v, i) => {
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
