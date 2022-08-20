import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Box
} from '@mui/material';
import { useWhitelistProjects } from "@hooks/useWhitelistProjects";
import { useContributionProjects } from "@hooks/useContributionProjects";
import Image from 'next/image';

var months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// PROJECT SCHEMA
// {
//   "name": "string",
//   "shortDescription": "string",
//   "description": "string",
//   "fundsRaised": 0,
//   "bannerImgUrl": "string",
//   "isLaunched": true,
//   "socials": {
//     "telegram": "string",
//     "twitter": "string",
//     "discord": "string",
//     "github": "string",
//     "website": "string",
//     "linkedin": "string"
//   },
//   "roadmap": {
//     "roadmap": [
//       {
//         "name": "string",
//         "description": "string",
//         "date": "string"
//       }
//     ]
//   },
//   "team": {
//     "team": [
//       {
//         "name": "string",
//         "description": "string",
//         "profileImgUrl": "string",
//         "socials": {
//           "telegram": "string",
//           "twitter": "string",
//           "discord": "string",
//           "github": "string",
//           "website": "string",
//           "linkedin": "string"
//         }
//       }
//     ]
//   },
//   "tokenomics": {
//     "tokenName": "string",
//     "totalTokens": 0,
//     "tokenTicker": "string",
//     "tokenomics": [
//       {
//         "name": "string",
//         "amount": 0,
//         "value": "string",
//         "tge": "string",
//         "freq": "string",
//         "length": "string",
//         "lockup": "string"
//       }
//     ]
//   },
//   "id": 0
// }
//
// WHITELIST EVENT SCHEMA
// {
//   "projectName": "",
//   "roundName": "",
//   "title": "",
//   "details": "",
//   "additionalDetails": {
//     "min_stake": 0,
//     "add_to_footer": false,
//     "staker_snapshot_whitelist": true
//   },
//   "id": 20,
//   "eventId": 42,
//   "subtitle": "Sign up for the ErgoPOS staker round whitelist",
//   "checkBoxes": {
//     "checkBoxText": []
//   }
// },
//
// CONTRIBUTION EVENT SCHEMA
// {
//   "id": 0,
//   "eventId": 0,
//   "subtitle": "",
//   "checkBoxes": {
//     "checkBoxes": [
//      "",
//     ]
//   },
//   "tokenName": "",
//   "tokenPrice": 0,
//   "whitelistTokenId": "",
//   "title": "",
//   "projectName": "",
//   "roundName": "",
//   "details": "",
//   "tokenId": "",
//   "tokenDecimals": 0,
//   "proxyNFTId": "",
//   "additionalDetails": {
//     "add_to_footer": false
//   }
// },

const ActiveRound = ({ projects, isLoading }) => {
  const [included, setIncluded] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const { whiteListProjectsActive, isLoading: whiteListProjectsIsLoading } =
    useWhitelistProjects();
  const {
    contributionProjectsActive, isLoading: contributionProjectsIsLoading,
  } = useContributionProjects();

  const checkProject = (project) => {
    return included.includes(project.name?.toLowerCase())
  }

  useEffect(() => {
    if (projects?.length !== 0) {
      contributionProjectsActive?.map((project) => (
        setIncluded(previous => [...previous, project.projectName.toLowerCase()])
      ))
      whiteListProjectsActive?.map((project) => (
        setIncluded(previous => [...previous, project.projectName.toLowerCase()])
      ))
    }
  }, [projects]);

  useEffect(() => {
    if (projects?.length !== 0) {
      console.log(projects)
      setFilteredProjects(projects?.filter(project => checkProject(project)))
    }
  }, [included]);

  return (
    <>
      {isLoading && (
        <>
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              left: "50%",
              marginLeft: "-12px",
              marginTop: "72px",
            }}
          /></>
      )}
      {filteredProjects.map((project) => (
        <Grid
          container
          key={project.id}
          direction="row"
        >
          <Grid item md={6} xs={12}>
        <Box sx={{
          width: '100px',
          height: '100px',
        }}
        >
            <Image src={project.bannerImgUrl} layout="responsive" width={512} height={512} />
            </Box>
            <Typography gutterBottom variant="h4" component="div">
              {project.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.shortDescription}
            </Typography>

          </Grid>
          <Grid item md={6} xs={12}>


            {project.roadmap.roadmap.map((item, i) => (
              <Grid container key={i} sx={{ mb: '24px' }}>
                <Grid item xs={1} md={2}>
                  <Typography sx={{ fontSize: '.875rem' }}>
                    {months[parseInt(item.date.slice(5, 7))]}
                  </Typography>
                  <Typography sx={{ fontSize: '2.25rem', lineHeight: 0.7 }}>
                    {item.date.slice(8, 10)}
                  </Typography>
                </Grid>
                <Grid item xs={11} md={10}>
                  {item.name}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))
      }
      <Divider sx={{ mb: 10 }} />
    </>
  );
};

export default ActiveRound;