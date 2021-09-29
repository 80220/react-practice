/** @jsxImportSource @emotion/react */
import { useEffect, useState, useRef, useCallback } from "react";
import { css } from "@emotion/react";
import { nanoid } from "nanoid";

import "./listing.css";

/*
  CSS-in-JS
 */
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
    > div:nth-of-type(2) {
      display: inline-block;
      width: 22px;
      height: 20px;
      max-width: 22px;
      max-height: 20px;
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
  > div > div > svg {
    padding: 0px 3px 0px 3px;
    margin-left: auto;
    :hover {
      cursor: pointer;
    }
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

const filterInputContainerCSS = css`
  display: inline-block;
  width: 15px;
  height: 15px;
  max-width: 15px;
  max-height: 15px;
  position: relative;
  left: -20px;
  top: 3px;
`;

const checkboxHeaderCSS = css`
  text-align: left;
  white-space: nowrap;
  width: 10px;
`;

const removeButtonCSS = css`
  background: red;
  color: white;
`;
/* 
  internal components
 */
function Icons() {
  return (
    <svg style={{ display: "none" }} version="2.0">
      <defs>
        <symbol
          id="filter-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </symbol>
        <symbol
          id="filter-icon-marked"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="rgb(231, 8, 8)"
          stroke="rgb(231, 8, 8)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
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
  );
}

function FilterInput({ content, setContent, filteredColumn }) {
  const [filter, setFilter] = useState("");
  return (
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
          content.forEach((c) => {
            if (
              c[filteredColumn]
                .toLowerCase()
                .startsWith(newFilter.toLowerCase())
            ) {
              c.__meta__.visible = true;
            } else {
              c.__meta__.visible = false;
            }
          });
          setContent([...content]);
        }}
        autoFocus
        spellCheck={false}
      ></input>
      <div
        css={filterInputContainerCSS}
        onClick={() => {
          setFilter("");
          content.forEach((c) => (c.__meta__.visible = true));
          setContent([...content]);
        }}
      >
        <svg viewBox="0 0 72.434 72.44">
          <use href="#cancel-icon" />
        </svg>
      </div>
    </label>
  );
}

function TableHeaders({
  content,
  setContent,
  setCheckedRowsNum,
  checkedRowsNum,
  sortFunc,
  filteredColumn,
  setFilteredColumn,
  masterFilterCheckbox
}) {
  const [columnNames, setColumnNames] = useState([]);
  const [sortedColumn, setSortedColumn] = useState(-1);
  const [sortingDirection, setSortingDirection] = useState(false);

  const checkBoxClick = (e) => {
    const visibleNum = content.reduce(function (previousValue, currentValue) {
      return previousValue + (currentValue.__meta__.visible ? 1 : 0);
    }, 0);
    if (e.target.checked) {
      setCheckedRowsNum(visibleNum);
    } else {
      setCheckedRowsNum(0);
    }
  };

  const sortedColumnName = useCallback(
    () => Object.keys(content[0])[sortedColumn],
    [content, sortedColumn]
  );

  const sortColumn = (selectedColumn) => {
    setContent([...sortFunc(content, sortingDirection, sortedColumnName())]);
    setSortingDirection(!sortingDirection);
    setSortedColumn(selectedColumn);
  };

  const sortItems = (e) => {
    if (content.length <= 1) return;
    const header = e.target;
    const selectedColumn = parseInt(header.getAttribute("index"), 10);
    sortColumn(selectedColumn);
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (content && content[0]) {
      const { __meta__, ...names } = content[0];
      setColumnNames(Object.keys(names));
    } else {
      setColumnNames([]);
      setCheckedRowsNum(0);
    }
  }, [content, setCheckedRowsNum]);

  // useEffect(() => {
  //   if (sortedColumn !== -1 && content.length > 1) {
  //     sortFunc(content, sortingDirection, sortedColumnName());
  //   }
  // });
  if (sortedColumn !== -1 && content.length > 1) {
    sortFunc(content, sortingDirection, sortedColumnName());
  }

  useEffect(() => {
    console.log("TableHeaders rendered");
    return () => {};
  });

  return (
    <tr key="-1">
      {columnNames.length > 0 && (
        <th css={checkboxHeaderCSS}>
          <label>
            <input
              ref={masterFilterCheckbox}
              type="checkbox"
              onClick={(e) => {
                checkBoxClick(e);
                content.forEach((c) => {
                  if (c.__meta__.visible) c.__meta__.checked = e.target.checked;
                });
                setContent([...content]);
              }}
            ></input>
            <button
              css={removeButtonCSS}
              style={checkedRowsNum > 0 ? {} : { display: "none" }}
              onClick={() => {
                const newContent = [];
                content.forEach((i, index) => {
                  if (i.__meta__.checked !== true) {
                    newContent.push(content[index]);
                  }
                });
                setContent(newContent);
                setCheckedRowsNum(0);
                masterFilterCheckbox.current.checked = false;
              }}
            >
              Remove
            </button>
          </label>
        </th>
      )}
      {columnNames.length > 0 ? (
        columnNames.map((columnName, index) => {
          return (
            <th key={columnName} css={headerCSS}>
              <div>
                <div>
                  <span index={index} onClick={sortItems}>
                    {columnName}
                  </span>
                  {sortedColumn === index ? (
                    sortingDirection ? (
                      <span className="sortable arrow-down arrow-down-active"></span>
                    ) : (
                      <span className="sortable arrow-up arrow-up-active"></span>
                    )
                  ) : (
                    <span className="sortable arrow-down"></span>
                  )}
                </div>
                <div>
                  <svg
                    viewBox="0 0 24 24"
                    onClick={(e) => {
                      setFilteredColumn(columnName);
                    }}
                  >
                    {filteredColumn === columnName ? (
                      <use href="#filter-icon-marked" />
                    ) : (
                      <use href="#filter-icon" />
                    )}
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
  );
}

function TableRows({
  content,
  setCheckedRowsNum,
  checkedRowsNum,
  masterFilterCheckbox
}) {
  const checkBoxClick = (e) => {
    if (e.target.checked) {
      setCheckedRowsNum(checkedRowsNum + 1);
    } else {
      setCheckedRowsNum(checkedRowsNum - 1);
      masterFilterCheckbox.current.checked = false;
    }
  };
  return (
    <>
      {content.map((item) => {
        return (
          <tr
            key={item.__meta__.id}
            css={rowCSS}
            style={item.__meta__.visible ? {} : { display: "none" }}
          >
            <td style={{}}>
              <label>
                <input
                  className="row-input"
                  type="checkbox"
                  onClick={(e) => {
                    checkBoxClick(e);
                    item.__meta__.checked = e.target.checked;
                  }}
                  checked={item.__meta__.checked}
                  onChange={(e) => {}}
                ></input>
              </label>
            </td>
            {Object.values(item).map((v, i) => {
              return !v.id ? <td key={i}>{v}</td> : false;
            })}
          </tr>
        );
      })}
    </>
  );
}
/* 
  public components
 */
function Listing({ items, changeItems, title, sortFunc }) {
  const [filteredColumn, setFilteredColumn] = useState(null);
  const [checkedRowsNum, setCheckedRowsNum] = useState(0);
  const masterFilterCheckbox = useRef(null);

  const initializeData = useCallback(() => {
    items.forEach((item) => {
      if (item.__meta__) return;
      item.__meta__ = {
        id: nanoid(),
        visible: true,
        checked: false
      };
    });
  }, [items]);

  initializeData();

  useEffect(() => {
    initializeData();
    if (items.length === 0) {
      setFilteredColumn(null);
    }
  }, [items, initializeData]);

  useEffect(() => {
    console.log("Listing mount");
  }, []);

  useEffect(() => {
    console.log("Listing rendering, items", items);
  });

  return (
    <>
      <Icons />
      {filteredColumn ? (
        <FilterInput
          content={items}
          setContent={changeItems}
          filteredColumn={filteredColumn}
        />
      ) : (
        false
      )}
      <table css={tableCSS}>
        <caption css={captitionStyle}>{title}</caption>
        <tbody>
          <TableHeaders
            content={items}
            setContent={changeItems}
            sortFunc={sortFunc}
            filteredColumn={filteredColumn}
            setFilteredColumn={setFilteredColumn}
            checkedRowsNum={checkedRowsNum}
            setCheckedRowsNum={setCheckedRowsNum}
            masterFilterCheckbox={masterFilterCheckbox}
          />
          <TableRows
            content={items}
            checkedRowsNum={checkedRowsNum}
            setCheckedRowsNum={setCheckedRowsNum}
            masterFilterCheckbox={masterFilterCheckbox}
          />
        </tbody>
      </table>
    </>
  );
}

export default Listing;
