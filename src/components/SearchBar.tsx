import { useState, useEffect } from 'react'
import NextLink from 'next/link'
import IUser from '../types/user'
import { TextField, InputAdornment, Grid, Card, Link, Avatar, Typography, Divider } from '@mui/material'
import Search from '@mui/icons-material/Search'

const size = {
    width: '33vw',
    '@media(max-width: 500px)': {
        width: '250px'
    }
}

const styles = {
    maxHeight: '242px',
    border: '1px solid #dbdbdb',
    borderRadius: '1px',
    backgroundColor: 'background.paper',
    overflowX: 'hidden',
    position: 'absolute',
    zIndex: '20',
    '&::-webkit-scrollbar': {
        backgroundColor: 'rgb(219, 219, 219, 0.5)'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgb(219, 219, 219)'
    }
}

interface Props {
    allUsers: IUser[]
}

export default function SearchBar({ allUsers }: Props) {
    const [search, setSearch] = useState<string>('')
    const [results, setResults] = useState<IUser[]>([])
    const [noResults, setNoResults] = useState<string>('')

    useEffect(() => {
        search &&
            setResults(allUsers.filter(user => user.fullName.toLowerCase().includes(search.toLowerCase())))
        search && setNoResults('Ningún usuario coincide con tu búsqueda')
        return () => {
            setResults([])
            setNoResults('')
        }
    }, [search])

    return (
        <form>
            <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => setTimeout(() => setSearch(''), 200)}
                InputProps={{
                    startAdornment:
                        <InputAdornment position='start'>
                            <Search />
                        </InputAdornment>
                }}
                sx={{ ...size, backgroundColor: 'background.paper', borderRadius: '1vh' }}
            />
            {search && results.length > 0 &&
                <Grid sx={{ ...size, ...styles }}>
                    {results?.map(result => (
                        <Card key={result.userName}>
                            <NextLink href={`/${result.userName}`} passHref legacyBehavior>
                                <Link underline='none' color='inherit' onClick={() => setSearch('')}>
                                    <Grid
                                        container
                                        alignItems='center'
                                        gap={2}
                                        wrap='nowrap'
                                        sx={{ paddingLeft: '10px', minHeight: '60px', '&:hover': { backgroundColor: 'primary.light', color: 'background.default' } }}
                                    >
                                        <Avatar
                                            src={result?.picture?.url}
                                            variant='rounded'
                                            sx={{ width: '40px', height: '40px' }}
                                        />
                                        <Grid item>
                                            <Typography>
                                                {result.fullName}
                                            </Typography>
                                            <Typography>
                                                {result.userName}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Link>
                            </NextLink>
                            <Divider />
                        </Card>
                    ))}
                </Grid>
            }
            {search && results.length === 0 && noResults &&
                <Grid
                    container
                    justifyContent='center'
                    alignItems='center'
                    sx={{ ...size, ...styles, minHeight: '60px' }}
                >
                    <Typography>
                        {noResults}
                    </Typography>
                </Grid>
            }
        </form>
    )
}