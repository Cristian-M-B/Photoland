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
    position: 'absolute'
}

interface Props {
    allUsers: IUser[]
}

export default function SearchBar({ allUsers }: Props) {
    const [search, setSearch] = useState<string>('')
    const [results, setResults] = useState<IUser[]>([])

    useEffect(() => {
        search &&
            setResults(allUsers.filter(user => user.fullName.toLowerCase().includes(search.toLowerCase())))
        return () => {
            setResults([])
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
                sx={{ ...size, backgroundColor: 'background.paper' }}
            />
            {search &&
                <Grid sx={{ ...size, ...styles }}>
                    {results?.map(result => (
                        <Card key={result.userName}>
                            <NextLink href={`/${result.userName}`} passHref legacyBehavior>
                                <Link underline='none' onClick={() => setSearch('')}>
                                    <Grid
                                        container
                                        alignItems='center'
                                        gap={2}
                                        wrap='nowrap'
                                        sx={{ paddingLeft: '10px', minHeight: '60px', '&:hover': { backgroundColor: 'background.default' } }}
                                    >
                                        <Avatar
                                            src={result?.picture}
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
        </form>
    )
}