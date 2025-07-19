import { useSelector, useDispatch } from 'react-redux'; // Import Redux hooks
import { useState, useEffect, useCallback } from 'react'; // Import useEffect

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert'; // For error display
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle'; // For error display
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress'; // For loading indicator

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { TransactionTableRow } from '../transaction-table-row';
import { TransactionTableHead } from '../transaction-table-head';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { TransactionTableToolbar } from '../transaction-table-toolbar';
import {
  clearSavingsError,
  getRecentTransactions // Import the transaction type from savings actions
} from '../../../redux/savings/savings.actions';

import type { AppDispatch } from '../../../redux/types'; // Import AppDispatch and AppState
import type { TransactionProps } from '../transaction-table-row'; // Reuse this type for display

// ----------------------------------------------------------------------

// Removed _transactions mock data, as it will come from Redux now.

export function TransactionsView() {
  const dispatch: AppDispatch = useDispatch();

  // Get data from Redux store
  const {
    transactions,
    totalTransactions,
    loading,
    error,
    currentPage,
    rowsPerPage: reduxRowsPerPage, // Get rowsPerPage from Redux state
  } = useSelector((state: any) => state.savings);

  // Use local state for table controls, but sync initial values from Redux
  const [page, setPage] = useState(currentPage);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [rowsPerPage, setLocalRowsPerPage] = useState(reduxRowsPerPage); // Use local state for rowsPerPage
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const [filterName, setFilterName] = useState('');

  // --- API Call Effect ---
  useEffect(() => {
    // Dispatch action to fetch data whenever page, rowsPerPage, orderBy, order, or filterName changes
    dispatch(getRecentTransactions(page, rowsPerPage, orderBy, order, filterName));
  }, [dispatch, page, rowsPerPage, orderBy, order, filterName]);

  // --- Error Clearing Effect ---
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearSavingsError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);


  // --- Table Control Callbacks ---
  const handleSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
      // When sorting changes, reset page to 0 to ensure correct data is fetched
      setPage(0); // This will trigger useEffect and refetch data
    },
    [order, orderBy]
  );

  const handleSelectAllRows = useCallback((checked: boolean) => {
    if (checked) {
      setSelected(transactions.map((tx: { id: any; }) => tx.id));
      return;
    }
    setSelected([]);
  }, [transactions]);

  const handleSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const handleResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalRowsPerPage(parseInt(event.target.value, 10));
      setPage(0); // Reset page when rows per page changes
    },
    []
  );

  const handleFilterName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    setPage(0); // Reset page when filter changes
  }, []);

  const dataFiltered: TransactionProps[] = applyFilter({
    inputData: transactions as TransactionProps[], // Cast to match TransactionProps
    comparator: getComparator(order, orderBy),
    filterName,
  });


  const notFound = !dataFiltered.length && !!filterName && !loading; // Adjust notFound logic


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
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
    
        >
          Perform Transaction
        </Button> */}
      </Box>

      <Card>
        <TransactionTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterName}
        />

        {loading && transactions.length === 0 && ( // Show main loader if initial data is loading
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
            <CircularProgress />
            <Typography variant="subtitle1" sx={{ ml: 2 }}>Loading transactions...</Typography>
          </Box>
        )}

        {error && ( // Show error alert
          <Alert severity="error" sx={{ m: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {!loading && !error && transactions.length === 0 && !filterName && (
          <Alert severity="info" sx={{ m: 3 }}>
            <AlertTitle>No Transactions Yet</AlertTitle>
            It looks like you haven&apos;t performed any transactions.
          </Alert>
        )}

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TransactionTableHead
                order={order}
                orderBy={orderBy}
                rowCount={transactions.length} // Pass current page row count for checkbox
                numSelected={selected.length}
                onSort={handleSort}
                onSelectAllRows={(checked) => handleSelectAllRows(checked)}
                headLabel={[
                  // { id: 'id', label: 'Transaction ID' },
                  { id: 'timestamp', label: 'Date' },
                  { id: 'name', label: 'Description' }, // Assuming 'name' is the description
                
                  { id: 'transaction_type_display', label: 'Type' }, // 'role' mapped to 'Type'
                  { id: 'amount', label: 'Amount (₦)', align: 'right' },
                  // { id: 'status', label: 'Status', align: 'center' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  // No need to slice if API handles pagination; otherwise, slice only the current page's data
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Keep if client-side pagination
                  .map((row: TransactionProps) => ( // Cast row to TransactionProps
                    <TransactionTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => handleSelectRow(row.id)}
                    />
                  ))}

                {/* TableEmptyRows and TableNoData should ideally be shown based on `dataFiltered` and `loading` */}
                {
                  // Show empty rows if there's no data AND no filter applied AND not loading
                  !loading && !filterName && transactions.length === 0 && (
                    <TableEmptyRows
                      height={68}
                      emptyRows={emptyRows(page, rowsPerPage, totalTransactions)}
                    />
                  )
                }

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={page}
          count={totalTransactions} // Use totalTransactions from Redux for actual count
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}