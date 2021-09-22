/** @jsxImportSource @emotion/react */
import { useEffect, useState, useRef } from "react";
import { css } from "@emotion/react";
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
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </symbol>
        <symbol
          id="filter-icon-marked"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="red"
          stroke="red"
          strokeWidth="2"
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

function FilterInput({ filteredColumn, filter, setFilter, content, meta }) {
  console.log("FilterInput", content, meta);
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
          content.forEach((c, index) => {
            if (
              c[filteredColumn]
                .toLowerCase()
                .startsWith(newFilter.toLowerCase())
            ) {
              meta[index].visible = true;
            } else {
              meta[index].visible = false;
            }
          });
        }}
        autoFocus
        spellCheck={false}
      ></input>
      <div
        css={filterInputContainerCSS}
        onClick={() => {
          setFilter("");
          meta.forEach((m) => (m.visible = true));
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
  meta,
  setChecked,
  checked,
  sortListing,
  setFilteredColumn,
  masterFilterCheckbox
}) {
  return (
    <tr key="0">
      {content && content[0] && (
        <th css={checkboxHeaderCSS}>
          <label>
            <input
              ref={masterFilterCheckbox}
              type="checkbox"
              onClick={(e) => {
                const visibleNum = meta.reduce(function (
                  previousValue,
                  currentValue
                ) {
                  return previousValue + (currentValue.visible ? 1 : 0);
                },
                0);
                if (e.target.checked) setChecked(visibleNum);
                else setChecked(0);
                meta.forEach((m) =>
                  m.visible ? (m.checked = e.target.checked) : false
                );
              }}
            ></input>
            <button
              css={removeButtonCSS}
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
          return (
            <th key={key} css={headerCSS}>
              <div>
                <div>
                  <span index={index} onClick={sortListing}>
                    {key}
                  </span>
                  <span className="sortable arrow-down"></span>
                </div>
                <div>
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
  );
}

function TableRows({
  content,
  setChecked,
  checked,
  meta,
  masterFilterCheckbox
}) {
  return (
    <>
      {content.map((item, index) => {
        return (
          <tr
            key={index}
            css={rowCSS}
            style={meta[index].visible ? {} : { display: "none" }}
          >
            <td style={{}}>
              <label>
                <input
                  className="row-input"
                  type="checkbox"
                  onClick={(e) => {
                    if (e.target.checked) setChecked(checked + 1);
                    else {
                      setChecked(checked - 1);
                      masterFilterCheckbox.current.checked = false;
                    }
                    meta[index].checked = e.target.checked;
                  }}
                  checked={meta[index].checked}
                ></input>
              </label>
            </td>
            {Object.values(item).map((v, i) => {
              return <td key={i}>{v}</td>;
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
function Listing({ items, name, sortFunc }) {
  const [content, setContent] = useState([]);
  const [currentCol, setCurrentCol] = useState(-1);
  const [direction, setDirection] = useState(false);
  const [filter, setFilter] = useState("");
  const [filteredColumn, setFilteredColumn] = useState(false);
  const [checked, setChecked] = useState(0);
  const [meta, setMeta] = useState([]);
  const masterFilterCheckbox = useRef(null);

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
    setContent(sortFunc(content, direction, key));

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
    console.log("Listing rendering, content", content, "meta", meta);
  });

  useEffect(() => {
    clearSorting();
    setContent(items);
    setMeta(
      Array(items.length)
        .fill()
        .map((i) => ({ visible: true, checked: false }))
    );
    if (items.length === 0) {
      setFilteredColumn(null);
      setChecked(0);
    }
  }, [items]);

  return (
    <>
      <Icons />
      {filteredColumn ? (
        <FilterInput
          content={content}
          meta={meta}
          filteredColumn={filteredColumn}
          filter={filter}
          setFilter={setFilter}
          setContent={setContent}
        />
      ) : (
        false
      )}
      <table css={tableCSS}>
        <caption css={captitionStyle}>{name}</caption>
        <tbody>
          <TableHeaders
            content={content}
            meta={meta}
            setChecked={setChecked}
            setContent={setContent}
            setFilteredColumn={setFilteredColumn}
            checked={checked}
            sortListing={sortListing}
            masterFilterCheckbox={masterFilterCheckbox}
          />
          <TableRows
            content={content}
            meta={meta}
            setChecked={setChecked}
            checked={checked}
            masterFilterCheckbox={masterFilterCheckbox}
          />
        </tbody>
      </table>
    </>
  );
}

export default Listing;
