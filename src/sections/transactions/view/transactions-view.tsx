 
import { useSelector, useDispatch } from 'react-redux'; 
import { useState, useEffect, useCallback } from 'react'; 

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';  
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';  
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress'; 

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { TransactionTableRow } from '../transaction-table-row';
import { TransactionTableHead } from '../transaction-table-head';
import { emptyRows, applyFilter, getComparator } from '../utils';
import {
  getRecentTransactions 
} from '../../../redux/savings/savings.actions';

import type { AppDispatch } from '../../../redux/types'; 
import type { TransactionProps } from '../transaction-table-row'; 


 
export function TransactionsView() {
  const dispatch: AppDispatch = useDispatch();

  const {
    transactions,
    loading,
    error,
    currentPage,
    rowsPerPage: reduxRowsPerPage, 
  } = useSelector((state: any) => state.savings);


  const [page, setPage] = useState(currentPage);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [rowsPerPage, setLocalRowsPerPage] = useState(reduxRowsPerPage);  
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    dispatch(getRecentTransactions(page, rowsPerPage, orderBy, order, filterName));
  }, [dispatch, page, rowsPerPage, orderBy, order, filterName]);

 
  const handleSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
      setPage(0); 
    },
    [order, orderBy]
  );

 
  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalRowsPerPage(parseInt(event.target.value, 10));
      setPage(0); 
    },
    []
  );
 

  const dataFiltered: TransactionProps[] = applyFilter({
    inputData: transactions as TransactionProps[],  
    comparator: getComparator(order, orderBy),
    filterName,
  });


  const notFound = !dataFiltered.length && !!filterName && !loading; 

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
      </Box>

      <Card>
        {loading && transactions.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
            <CircularProgress />
            <Typography variant="subtitle1" sx={{ ml: 2 }}>Loading transactions...</Typography>
          </Box>
        )}

        {error && (
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
                rowCount={transactions.length} 
                numSelected={selected.length}
                onSort={handleSort}
                headLabel={[
                  { id: 'name', label: 'Description' },
                  { id: 'transaction_type_display', label: 'Type' },
                  { id: 'timestamp', label: 'Date' },
                  { id: 'amount', label: 'Amount (₦)', align: 'right' },
                  { id: 'fee', label: 'Fee (₦)', align: 'right' },
                  { id: 'net_amount', label: 'Net (₦)', align: 'right' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .map((row: TransactionProps) => (
                    <TransactionTableRow
                      key={row.id}
                      row={row}
                    />
                  ))}
 
                {
                  !loading && !filterName && transactions.length === 0 && (
                    <TableEmptyRows
                      height={68}
                      emptyRows={emptyRows(page, rowsPerPage, transactions.length)}
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
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}