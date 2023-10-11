import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Box,
  Typography
} from "@mui/material";

function getOrdering(currentOrder) {
  return currentOrder.startsWith("-") ? "desc" : "asc";
}

function getOrderingKey(currentOrder) {
  return currentOrder.startsWith("-")
    ? currentOrder.substring(1)
    : currentOrder;
}

function toggleOrderBy(orderKey, currentOrder) {
  const currentKey = currentOrder.startsWith("-")
    ? currentOrder.substring(1)
    : currentOrder;

  if (currentKey === orderKey) {
    return currentOrder.startsWith("-") ? orderKey : `-${orderKey}`;
  }
  return orderKey;
}

export class TableHeaderMixin {
  constructor({ key, label, align = "left", orderable = false, accessor = null, sx={}, sxTh="auto"}) {
    this.accessor = accessor ? accessor : key;
    return {
      key: key,
      label: label,
      align: align,
      orderable: orderable,
      accessor: this.accessor,
      style:sx,
      sxTh
    };
  }
}

export class TableRowsMixin {
  constructor(data, renders = {}) {
    return {
      renders: renders,
      data: data,
    };
  }
}

export default function TablesMixin({
  orderBy: orderByProp = null,
  headers: headersProp,
  bodis: bodisProp,
}) {
  const headers = headersProp;
  const bodies = bodisProp.data;
  const renders = bodisProp.renders;

  let ordering = undefined;
  let orderingKey = null;
  let [orderBy, setOrderBy] = [undefined, undefined];

  if (orderByProp) {
    [orderBy, setOrderBy] = orderByProp;
    ordering = getOrdering(orderBy);
    orderingKey = getOrderingKey(orderBy);
  }

  const renderFunctions = {};
  Object.keys(renders).forEach((key) => {
    renderFunctions[key] = renders[key];
  });

  function renderTableHeader() {
    return (
      <TableRow>
        {headers.map((header, index) => (
          <TableCell key={`${header.key}-${index}`} align={header.align} sx={{ ...header.sxTh }}>
            {header.orderable && ordering && orderingKey !== null ? (
              <TableSortLabel
                sx={{ width: "100%", ...header.style }}
                active={orderingKey === header.accessor}
                direction={ordering}
                IconComponent={KeyboardArrowDownIcon}
                onClick={() => setOrderBy(toggleOrderBy(header.accessor, orderBy))}
              >
                {header.label}
              </TableSortLabel>
            ) : (
              <Box sx={{ p: 0.25, ...header.style  }}>{header.label}</Box>
            )}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function renderTableBody(body, index) {
    return (
      <TableRow
        key={index}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        {headers.map((header, rowIndex) => {
          const { key, accessor, align } = header;
          const content = renderFunctions[key]
            ? renderFunctions[key](body[accessor], body)
            : body[accessor];
          return (
            <TableCell component="th" scope="row" key={key} align={align}>
              {content}
            </TableCell>
          );
        })}
      </TableRow>
    );
  }

  return (
    <>
      <TableContainer component={"div"}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>{renderTableHeader()}</TableHead>
          <TableBody>
            {bodies.length ? 
              bodies.map((body, index) => renderTableBody(body, index)) 
              : 
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center" colSpan={headers.length}>
                  <Typography variant="h6" >
                    Nessun elemento da visualizzare
                  </Typography>
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
