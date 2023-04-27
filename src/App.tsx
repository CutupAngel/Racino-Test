import React, { useMemo, useState, useEffect } from 'react';
import _ from "lodash";
import './App.css';
import { Box, Typography, Grid } from '@mui/material';
import { DEBOUNCE_DELAY } from './config';
import { getUserInfo, getUserReposInfo } from './hooks';
import Select from 'react-select';
import { IOption } from './type';
import Repository from './components/Repository/Repository';

function App() {
  const [loginName, setLoginName] = useState<string>("");
  const [options, setOptions] = useState<IOption[]>([]);
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    const getRepos = async () => {
      const { data } = await getUserReposInfo(loginName);
      setRepos(data?.repositoryOwner?.repositories?.nodes);
    }
    getRepos();
  }, [loginName]);

  const debouncedHanlder = useMemo(() => _.debounce(async (userInput: string) => {
    if (!userInput) {
      return;
    }
    setLoginName(userInput);
    const { data: userInfo, errors: errors } = await getUserInfo(userInput);
    if (errors?.length > 0) {
      return;
    }
    setOptions((prev) => ([...prev, { value: userInput, loginName: userInput, avatar: userInfo.user.avatarUrl }]));
  }, DEBOUNCE_DELAY), []);

  const handleSelectInputChanged = (value: string) => {
    if (options.findIndex((item) => item.loginName === value) !== -1) {
      return;
    }
    debouncedHanlder(value);
  }

  const handleChanged = (e: any) => {
    setLoginName(e.value);
  }

  return (
    <Box>
      <Typography textAlign="center">
        Please wait for a seconds to look up from github
      </Typography>
      <Box>
        <Select
          options={options}
          onInputChange={handleSelectInputChanged}
          onChange={handleChanged}
          placeholder="Type any github login name to lookup; ex: cutupAngel"
          value={options.find((item) => item.loginName === loginName)}
          isSearchable={true}
          formatOptionLabel={(option) => {
            return (
              <Box
                sx={{
                  display: 'flex',
                  alignContent: "center",
                }}
              >
                <img
                  src={option.avatar}
                  style={{ paddingRight: "5px", width: "20px", height: "20px" }}
                />
                <Typography>{option.loginName}</Typography>
              </Box>
            );
          }} />
      </Box>
      <Grid container spacing={2} sx={{ justifyContent: "center" }} direction="column" p={3}>
        {repos && repos?.length > 0 && (repos.map((repo, index) => (
          <Repository key={index} currentUser={loginName} repo={repo} />
        )))}
      </Grid>
    </Box >
  );
}

export default App;
