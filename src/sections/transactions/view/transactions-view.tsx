import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';
// Import _mock functions for data generation
import {
  _id,
  _times, // Using for avatar/conceptual name
  _price,
  _company, // Using for conceptual category
  _boolean, // Using for status
  _postTitles, // Using for description
  _description, // Using for detailed address/notes
} from 'src/_mock'; // Assuming your mock functions are here

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { TransactionTableRow } from '../transaction-table-row'; // <<< IMPORT TransactionProps here
import { TransactionTableHead } from '../transaction-table-head';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { TransactionTableToolbar } from '../transaction-table-toolbar';

// Import TransactionTableRow and its associated type
import type { TransactionProps } from '../transaction-table-row';

// ----------------------------------------------------------------------

// Removed the duplicate TransactionProps interface definition from here.
// It's now imported from transaction-table-row.tsx.

// Construct _transactions data using the _mock functions, ensuring it matches TransactionProps
export const _transactions: TransactionProps[] = Array.from({ length: 24 }).map((_, index) => {
  const transactionType = index % 3 === 0 ? 'Credit' : 'Debit'; // Vary types
  const transactionStatus = _boolean(index)
    ? 'Completed'
    : index % 2 === 0
      ? 'Pending'
      : 'Failed';

  return {
    id: _id(index), // Unique transaction ID
    avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`, // Example avatar URL
    name: _postTitles(index), // Main transaction description
    company: _company(index), // Transaction category/source
    role: transactionType, // 'Debit' or 'Credit'
    isVerified: _boolean(index), // Verification status for the transaction
    status: transactionStatus, // 'Completed', 'Pending', 'Failed'
    createdAt: _times(index), // Transaction date and time
    balance: _price(index), // Transaction amount
    email: `ref_${_id(index).substring(_id(index).length - 6)}@gidinest.com`, // Conceptual transaction reference email
    phoneNumber: `+2348${index}7654321`, // Conceptual associated phone number
    address: _description(index), // Detailed transaction notes
  };
});


export function TransactionsView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: TransactionProps[] = applyFilter({
    inputData: _transactions, // Use _transactions data
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          My Transactions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Perform Transaction
        </Button>
      </Box>

      <Card>
        <TransactionTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TransactionTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_transactions.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _transactions.map((tx) => tx.id)
                  )
                }
                headLabel={[
                  { id: 'id', label: 'Transaction ID' }, // Changed from transactionId for direct mapping to row.id
                  { id: 'createdAt', label: 'Date' }, // Changed from date for direct mapping to row.createdAt
                  // { id: 'name', label: 'Description' }, // Changed from description for direct mapping to row.name
                  { id: 'balance', label: 'Amount (₦)', align: 'right' }, // Changed from amount for direct mapping to row.balance
                  { id: 'role', label: 'Type' }, // Changed from type for direct mapping to row.role
                  { id: 'status', label: 'Status', align: 'center' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <TransactionTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _transactions.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_transactions.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('createdAt'); // Default sort by createdAt (date)
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}