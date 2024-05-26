import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import styles from './table.module.scss';

interface TableProps {
  foo?: string;
  data?: Array<{ type: string; name: string; value: string; ttl: string }>;
}

const StepTwoTable: React.FC<TableProps> = ({ data }) => (
  <div className={styles.card}>
    <TableContainer>
      <Table sx={{ maxWidth: 600 }} size='small' aria-label='a dense table'>
        <TableHead
          sx={{
            backgroundColor: '#FAFAFC',
            '&:first-child td, &:first-child th': { border: '0px' },
          }}>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell align='center'>Name/Host</TableCell>
            <TableCell align='center'>Value/Content</TableCell>
            <TableCell align='center'>TTL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, index) => (
            <TableRow
              key={index}
              className={styles.row}
              sx={{
                '&:last-child td, &:last-child th': { border: '0px' },
                height: '60px',
              }}>
              <TableCell>{row.type}</TableCell>
              <TableCell align='center'>{row.name}</TableCell>
              <TableCell align='center'>{row.value}</TableCell>
              <TableCell align='center'>{row.ttl}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export default StepTwoTable;
