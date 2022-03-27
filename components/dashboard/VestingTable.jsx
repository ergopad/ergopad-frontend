import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import theme from '@styles/theme';
import useMediaQuery from '@mui/material/useMediaQuery';


const vestedHeading = {
    amount: 'Number of Tokens',
    date: 'Date Releasing', 
}

const VestingTable = ({ vestedObject }) => {
    const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'));

    if (vestedObject.length === 0) {
        return <>
            <Box>
                <Typography variant="p" color="text.primary" sx={{ fontWeight: '400', fontSize: '1rem', mb: 1, pl: 1 }}>
                    Looks like you do not have any locked tokens associated with your wallet.
                </Typography>
            </Box>
        </>
    }

    return (
        <>{vestedObject.map(vestedToken => (
            <Box sx={{ mt: 4 }} key={vestedToken.tokenId}>
                <Typography variant="p" color="text.primary" sx={{ fontWeight: '600', fontSize: '1rem', mb: 1, pl: 1 }}>
                    Name: {' '}
                    <Typography variant="span" color="text.secondary" sx={{ textTransform: 'capitalize', fontWeight: '400' }}>
                        {vestedToken.name}
                    </Typography>
                </Typography>
                <Typography variant="p" color="text.primary" sx={{ fontWeight: '600', fontSize: '1rem', mb: 1, pl: 1 }}>
                    Total Locked: {' '}
                    <Typography variant="span" color="text.secondary" sx={{ textTransform: 'capitalize', fontWeight: '400' }}>
                        {vestedToken.totalVested}
                    </Typography>
                </Typography>
                {checkSmall ? (
                    <Table sx={{ mb: 3 }} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: '600' }}>
                                    {vestedHeading.date}
                                </TableCell>
                                <TableCell sx={{ fontWeight: '600' }}>
                                    {vestedHeading.amount}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        
                        <TableBody>
                            {vestedToken.outstanding.map((vested, index) => {
                                return(
                                    <TableRow key={index}>
                                        <TableCell sx={{ color: theme.palette.text.secondary }}>
                                            {vested.date}
                                        </TableCell>
                                        <TableCell sx={{ color: theme.palette.text.secondary }}>
                                            {vested.amount}
                                        </TableCell>
                                    </TableRow>
                                )
                                })}
                        </TableBody>
                    </Table>
                    ) : (
                    <Table sx={{ p: 0 }}>
                        {vestedToken.outstanding.map((vested) => {
                            return(<>
                                <TableRow sx={{ borderTop: `1px solid #444` }}>
                                    <TableCell sx={{ color: theme.palette.text.secondary, border: 'none', p: 1, pt: 2 }}>
                                        {vestedHeading.amount}
                                    </TableCell>
                                    <TableCell sx={{ border: 'none', p: 1, pt: 2 }}>
                                        {vested.amount}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ color: theme.palette.text.secondary, border: 'none', p: 1 }}>
                                        {vestedHeading.date}
                                    </TableCell>
                                    <TableCell sx={{ border: 'none', p: 1 }}>
                                        {vested.date}
                                    </TableCell>
                                </TableRow>
                            </>)
                            })}
                    </Table>
                    )
                }

            </Box>
        ))}</>
    )
}



export default VestingTable;