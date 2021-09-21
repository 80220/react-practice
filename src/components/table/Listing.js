/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import "./listing.css";

const captitionStyle = css`
  background: #ddd;
  padding: 5px;
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

const labelFilterCSS = css`
  white-space: nowrap;
  font-family: Tahoma;
  font-size: 0.8em;
  font-weight: 600;
  color: rgb(39, 79, 50);
`;

const inputFilterCSS = css`
  width: 300px;
  height: 20px;
  border: 2px solid black;
  border-radius: 5px;
  ::placeholder {
    font-style: italic;
    font-size: 0.9em;
  }
`;

const filterIconContainerCSS = css`
  display: inline-block;
  width: 15px;
  height: 15px;
  max-width: 15px;
  max-height: 15px;
  position: relative;
  top: 3px;
`;

const checkboxHeaderCSS = css`
  text-align: left;
  white-space: nowrap;
  width: 10px;
`;

const removeButttonCSS = css`
  background: red;
  color: white;
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
      {/* icons */}
      <svg style={{ display: "none" }} version="2.0">
        <defs>
          <symbol
            id="filter-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-filter"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </symbol>
          <symbol
            id="cancel-icon"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 72.434 72.44"
          >
            <path
              d="M36.22,0C16.212,0,0,16.216,0,36.227c0,19.999,16.212,36.214,36.22,36.214
c20.011,0,36.214-16.215,36.214-36.214C72.434,16.215,56.231,0,36.22,0z M52.058,46.82c1.379,1.424,0.953,4.078-0.959,5.932
c-1.911,1.854-4.577,2.209-5.959,0.785l-9.027-9.295l-9.298,9.027c-1.421,1.379-4.075,0.947-5.929-0.961s-2.206-4.574-0.785-5.956
l9.298-9.027l-9.027-9.298c-1.379-1.421-0.946-4.078,0.962-5.932c1.905-1.851,4.577-2.204,5.953-0.785l9.027,9.297l9.301-9.023
c1.424-1.382,4.078-0.95,5.929,0.958c1.857,1.908,2.206,4.577,0.785,5.959l-9.295,9.024L52.058,46.82z"
            />
          </symbol>
        </defs>
      </svg>
      {/*** filtering ***/}
      {filteredColumn ? (
        <label css={labelFilterCSS}>
          <div css={filterIconContainerCSS}>
            <svg viewBox="0 0 24 24">
              <use href="#filter-icon" />
            </svg>
          </div>
          {filteredColumn}
          {": "}
          <input
            type="text"
            placeholder="...enter filter..."
            css={inputFilterCSS}
            value={filter}
            onChange={(e) => {
              const newFilter = e.target.value;
              setFilter(newFilter);
              setContent(
                Array.from(content).map((c) => {
                  if (
                    c[filteredColumn]
                      .toLowerCase()
                      .startsWith(newFilter.toLowerCase())
                  ) {
                    c.__meta__.visible = true;
                  } else {
                    c.__meta__.visible = false;
                  }
                  return c;
                })
              );
            }}
            autoFocus
            spellCheck={false}
          ></input>
          <div
            style={{
              display: "inline-block",
              width: "15px",
              height: "15px",
              maxWidth: "15px",
              maxHeight: "15px",
              position: "relative",
              left: "-20px",
              top: "3px"
            }}
            onClick={() => {
              setFilter("");
              setContent(
                [...content].map((c) => {
                  c.__meta__.visible = true;
                  return c;
                })
              );
            }}
          >
            <svg viewBox="0 0 72.434 72.44">
              <use href="#cancel-icon" />
            </svg>
          </div>
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
                  <button
                    css={removeButttonCSS}
                    style={checked > 0 ? {} : { display: "none" }}
                    onClick={() => {
                      alert("Whoof!");
                    }}
                  >
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
                      <div
                        style={{
                          display: "inline-block",
                          width: "22px",
                          height: "20px",
                          maxWidth: "22px",
                          maxHeight: "20px"
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          onClick={(e) => {
                            setFilteredColumn(key);
                          }}
                        >
                          <use href="#filter-icon" />
                        </svg>
                      </div>
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
                      className="row-input"
                      type="checkbox"
                      onClick={(e) => {
                        // console.log("e", e);
                        if (e.target.checked) setChecked(checked + 1);
                        else setChecked(checked - 1);
                        item.__meta__.checked = e.target.checked;
                      }}
                      onChange={(e) => {
                        // console.log(e);
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
