import React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const BoxWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  margin: 10px;
  z-index: 1;
  background-color: white;
  border-radius: 4px;
`;

function Control({ layer, handleChange }) {
    return (
        <BoxWrapper>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Layer</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={layer}
              label="Layer"
              onChange={handleChange}
            >
              <MenuItem value={"cases"}>Cases</MenuItem>
              <MenuItem value={"deaths"}>Deaths</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </BoxWrapper>
    );
}

export default Control;

