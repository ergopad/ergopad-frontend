import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    useMediaQuery,
    Typography,
  } from '@mui/material';
import theme from '../styles/theme'
import { Fragment } from 'react';

const tokenomicsHeading = {
    name: 'Name',
    amount: 'Amount',
    value: 'Value',
    tge: 'TGE',
    freq: 'Frequency',
    length: 'Length',
    lockup: 'Cliff'
}

const tokenomicsKeys = Object.keys(tokenomicsHeading);
const tokenomicsHeadingValues = Object.values(tokenomicsHeading);

const tokenomics = [
    {
        name: 'Seed Round',
        amount: 50000000,
        value: '$0.01',
        tge: '10%',
        freq: 'Monthly',
        length: '24 Months',
        lockup: '1 Month',
    },
    {
        name: 'Strategic Round',
        amount: 30000000,
        value: '$0.02',
        tge: '10%',
        freq: 'Monthly',
        length: '12 Months',
        lockup: '1 Month',
    },
    {
        name: 'Liquidity',
        amount: 20000000,
        value: '$0.03',
        tge: '100%',
        freq: '',
        length: '',
        lockup: '',
    },
];

const totalTokens = 38000000
const tokenName = 'Paideia'
const tokenTicker = 'PAI'

const Distribution = () => {
    const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'));

    const largeHeading = tokenomicsHeadingValues.map(value => {
        return(
            <TableCell sx={{ fontWeight: '800' }}>
                {value}
            </TableCell>
        )
    })

    return (
    <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
            Token Name: 
            <Typography component="span" color="text.primary" sx={{ fontWeight: '700' }}>{' '}{tokenName}</Typography>
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
            Token Ticker: 
            <Typography component="span" color="text.primary" sx={{ fontWeight: '700' }}>{' '}{tokenTicker}</Typography>
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
            Total Distribution: 
            <Typography component="span" color="text.primary" sx={{ fontWeight: '700' }}>{' '}{totalTokens.toLocaleString(navigator.language, { maximumFractionDigits: 0 })}</Typography>
        </Typography>
        {checkSmall ? (
            <Table>
                <TableHead>
                    <TableRow>
                        {largeHeading}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tokenomics.map((round) => {
                        const keysLoop = tokenomicsKeys.map(key => {
                            return (
                                <TableCell>
                                    {round?.[key]
                                        .toLocaleString(navigator.language, { maximumFractionDigits: 0 })
                                    }
                                </TableCell>
                            )
                        })
                        return (
                            <TableRow key={round.name}>
                                {keysLoop}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        ) : (
            <Table sx={{ p: 0 }}>
            {tokenomics.map((round) => {
                const keysLoop = tokenomicsKeys.map((key, i) => {
                    if (round?.[key]) {
                        if (i == 0) {
                            return (
                                <TableRow sx={{ borderTop: `1px solid #444` }}>
                                    <TableCell
                                        sx={{
                                        color: theme.palette.text.secondary,
                                        border: 'none',
                                        p: 1,
                                        }}
                                    >
                                        {tokenomicsHeading[key]}:
                                    </TableCell>
                                    <TableCell sx={{ border: 'none', p: 1, pt: 2 }}>
                                        {round?.[key]}
                                    </TableCell>
                                </TableRow>
                            )
                        }
                        else if (i < tokenomicsKeys.length - 1) {
                            return (
                                <TableRow>
                                    <TableCell
                                        sx={{
                                        color: theme.palette.text.secondary,
                                        border: 'none',
                                        p: 1,
                                        }}
                                    >
                                        {tokenomicsHeading[key]}:
                                    </TableCell>
                                    <TableCell sx={{ border: 'none', p: 1 }}>
                                        {round?.[key].toLocaleString(navigator.language, { maximumFractionDigits: 0 })}
                                    </TableCell>
                                </TableRow>
                            )
                        }
                        else {
                            return (
                                <TableRow>
                                    <TableCell
                                        sx={{
                                        color: theme.palette.text.secondary,
                                        border: 'none',
                                        p: 1,
                                        }}
                                    >
                                        {tokenomicsHeading[key]}:
                                    </TableCell>
                                    <TableCell sx={{ border: 'none', p: 1, pb: 2 }}>
                                        {round?.[key]}
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    }
                })
                return (
                <Fragment key={round.name}>
                    {keysLoop}
                </Fragment>
                );
            })}
            </Table>
        )}
    </Paper>
    );
};

export default Distribution;
