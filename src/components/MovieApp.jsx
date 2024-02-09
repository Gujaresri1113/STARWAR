import React, { useState, useEffect } from 'react';
import { TextField, Grid, Paper, Typography, Menu, MenuItem, Button } from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';


function convertToRoman(num) {
    const romanNumerals = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };

    let roman = "";

    for (let key in romanNumerals) {
        while (num >= romanNumerals[key]) {
            roman += key;
            num -= romanNumerals[key];
        }
    }

    return roman;
}

function MovieApp() {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [sortByAnchorEl, setSortByAnchorEl] = useState(null);
    const [sortBy, setSortBy] = useState('episode_id');
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await axios.get('https://swapi.dev/api/films/?format=json');
            setMovies(response.data.results);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    const handleSortByClick = (event) => {
        setSortByAnchorEl(event.currentTarget);
    };

    const handleSortByClose = (sortByValue) => {
        setSortBy(sortByValue);
        setSortByAnchorEl(null);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedMovies = filteredMovies.sort((a, b) => a[sortBy] - b[sortBy]);

    return (
        <Grid container justifyContent="center" alignItems="stretch">
            <Grid item xs={12} >
                <Paper elevation={3} style={{ padding: '10px 20px', backgroundColor: '#e1f1f1', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <Button variant="outlined" onClick={handleSortByClick} style={{ fontWeight: 'bold',backgroundColor: 'white', marginTop: '8px', height: '55px', width:'100px',marginBottom: '10px' }} >
                        Sort By..
                    </Button>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <TextField
                            placeholder="Search movies...."
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={{ marginLeft: '10px' ,backgroundColor: 'white'}}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <div>
                                        <IconButton>
                                            <SearchIcon />
                                        </IconButton>
                                    </div>
                                )
                            }}

                        />
                    </div>
                    <Menu
                        anchorEl={sortByAnchorEl}
                        open={Boolean(sortByAnchorEl)}
                        onClose={() => handleSortByClose(sortBy)}
                    >
                        <MenuItem onClick={() => handleSortByClose('episode_id')}>Episode</MenuItem>
                        <MenuItem onClick={() => handleSortByClose('release_date')}>Year</MenuItem>
                    </Menu>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Paper elevation={3} md={6} style={{ marginTop: "8px", width: "100%", height: "100%", maxHeight: "80vh", overflowY: "auto", padding: 20 }}>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {sortedMovies.map((movie, index) => (
                            <li key={movie.episode_id} style={{ marginBottom: "10px" }}>
                                <div
                                    className="p-2 hover:bg-gray-200 flex justify-between items-center cursor-pointer"
                                    onClick={() => handleMovieClick(movie)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <Typography>{`EPISODE ${movie.episode_id}`}</Typography>
                                        <div style={{ marginLeft: "10px" }}>
                                            <Typography style={{ fontWeight: "bold" }}>{`Episode ${convertToRoman(movie.episode_id)} - ${movie.title}`}</Typography>
                                        </div>
                                            <Typography style={{ flexShrink: 0, marginLeft: "auto" }}>{movie.release_date}</Typography>
                                    </div>

                                </div>
                                {index !== sortedMovies.length - 1 && (
                                    <hr style={{ borderTop: "1px solid #e0e0e0", margin: "10px 0" }} />
                                )}
                            </li>
                        ))}
                    </ul>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Paper elevation={3} style={{ marginTop: "8px", width: "100%", height: "100%", maxHeight: "100vh", overflowY: "auto", padding: 20 }}>
                    {selectedMovie ? (
                        <div>
                            <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>{`Episode ${convertToRoman(selectedMovie.episode_id)} - ${selectedMovie.title}`}</Typography>
                            <Typography variant="body1" style={{ marginBottom: "10px" }}>{selectedMovie.opening_crawl}</Typography>
                            <Typography variant="body1">Director : {selectedMovie.director}</Typography>
                        </div>
                    ) : (
                        <Typography variant="body1" style={{ marginTop: "150px", marginLeft: "250px" }}>No movie selected</Typography>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}

export default MovieApp;
