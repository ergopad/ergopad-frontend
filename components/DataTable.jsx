import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  TableContainer,
  Container,
  Paper
} from '@mui/material';
import theme from '@styles/theme';
import { Fragment, useEffect, useState } from 'react';

const DataTable = ({ data }) => {
  const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const [navigatorVar, setNavigatorVar] = useState('')
  useEffect(() => {
    if (navigator) {
      setNavigatorVar(navigator)
    }
  }, [])

  const largeHeading = data.header.map((value, i) => {
    const uniqueHeaderKey = i + '-header'
    return (
      <TableCell key={uniqueHeaderKey} sx={{ fontWeight: '800' }}>
        {value}
      </TableCell>
    );
  });

  return (
    <TableContainer sx={{ border: '1px solid #444', mb: 3 }}>
      {checkSmall ? (
        <Table>
          <TableHead>
            <TableRow key="table-header">{largeHeading}</TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((oneRow, i) => {
              const rowLoop = oneRow.map((cellItem, i) => {
                return (
                  <TableCell key={'main-table-cell' + i}>
                    {cellItem.toLocaleString(navigatorVar.language, {
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                );
              });
              return <TableRow key={'unique-table-row' + i}>{rowLoop}</TableRow>;
            })}
          </TableBody>
        </Table>
      ) : (
        <Table sx={{ p: 0 }}>
          <TableBody sx={{ }}>
            {data.data.map((oneRow, i) => {
              const rowLoop = oneRow.map((cellItem, ii) => {
                let rowStyle = { }
                let cellStyle = { 
                  p: 1, 
                  border: 'none', 
                  wordWrap: 'break-word', 
                }
                if (ii == 0) {
                  rowStyle = { ...rowStyle, borderTop: '1px solid #444' }
                  cellStyle = { ...cellStyle, pt: 2 }
                }
                else if (ii < data.header.length - 1 && data.header.length > 2) {
                  rowStyle = { ...rowStyle, }
                  cellStyle = { ...cellStyle, border: 'none', p: 1 }
                }
                else {
                  rowStyle = { ...rowStyle, borderBottom: '1px solid #444' }
                  cellStyle = { ...cellStyle, border: 'none', p: 1, pb: 2 }
                }
                const keyString = cellItem.toString().split(" ").join("") + i
                return (
                  <TableRow key={keyString + 'row' + i} sx={rowStyle}>
                    <TableCell
                      sx={{
                        color: theme.palette.text.secondary,
                        ...cellStyle
                      }}
                      key={keyString + '1' + i}
                    >
                      {data.header[ii]}:
                    </TableCell>
                    <TableCell key={keyString + '2' + i} sx={cellStyle}>
                      {cellItem.toLocaleString(navigatorVar.language, {
                        maximumFractionDigits: 0,
                      })}
                    </TableCell>
                  </TableRow>
                )
              });
              return <Fragment key={oneRow[0] + 'fragItem' + i}>{rowLoop}</Fragment>;
            })}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default DataTable;
