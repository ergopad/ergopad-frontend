import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Box,
  Paper
} from '@mui/material';
import { useWhitelistProjects } from "@hooks/useWhitelistProjects";
import { useContributionProjects } from "@hooks/useContributionProjects";
import Image from 'next/image';
import Link from 'next/link';

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
//   "id": 0,
//   "eventId": 0,
//   "subtitle": "",
//   "checkBoxes": {
//     "checkBoxText": []
//   }
// },

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

const buttonStyles = {
  height: '60px',
  width: '100%',
  justifyContent: 'flex-start'

}

const ButtonNextLink = ({ roundType, roundName, itemName, projectName, link, disabled }) => {
  if (disabled) return (
    <Button variant="contained" disabled sx={buttonStyles}>
      {itemName}
    </Button>
  )
  else if (link) return (
    <Button href={link} variant="contained" target="_blank" sx={buttonStyles}>
      {itemName}
    </Button>
  )
  else return (
    <Link
      href={"/" + roundType + "/" + projectName + "/" + roundName + "/"}
      passHref
    >
      <Button variant="contained" sx={buttonStyles}>
        {itemName}
      </Button>
    </Link>
  )
}

const CheckButtonType = ({ name, activeRounds, project }) => {
  if (
    name.toLowerCase().includes('whitelist') &&
    name.toLowerCase().includes('seed') &&
    activeRounds.some(attr => (
      attr.projectName.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") ===
      project.name.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") &&
      attr.roundName.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") === "seed") &&
      attr.title.toLowerCase().includes('whitelist' || 'white list' || 'white-list')
    )
  ) {
    return <ButtonNextLink roundName="seed" roundType="whitelist" itemName={name} projectName={project.name.toLowerCase()
      .replaceAll(" ", "")
      .replaceAll(/[^a-zA-Z0-9]/g, "")} />
  }
  else if (name.toLowerCase().includes('contribution')
    && name.toLowerCase().includes('seed')
    && activeRounds.some(attr => (
      attr.projectName.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") ===
      project.name.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") &&
      attr.roundName.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") === "seed") &&
      attr.title.toLowerCase().includes('contribution')
    )) {
    return <ButtonNextLink roundName="seed" roundType="contribute" itemName={name} projectName={project.name.toLowerCase()
      .replaceAll(" ", "")
      .replaceAll(/[^a-zA-Z0-9]/g, "")} />
  }
  else if ((name.toLowerCase().includes('whitelist') || name.toLowerCase().includes('snapshot'))
    && name.toLowerCase().includes('staker')
    && activeRounds.some(attr => (
      attr.projectName.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") ===
      project.name.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") &&
      attr.roundName.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") === "staker") &&
      attr.title.toLowerCase().includes('whitelist' || 'white list' || 'white-list')
    )) return (
      <ButtonNextLink roundName="staker" roundType="whitelist" itemName={name} projectName={project.name.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "")} />
    )
  else if (name.toLowerCase().includes('contribution')
    && name.toLowerCase().includes('staker')
    && activeRounds.some(attr => (
      attr.projectName.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") ===
      project.name.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") &&
      attr.roundName.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") === "staker") &&
      attr.title.toLowerCase().includes('contribution')
    )) return (
      <ButtonNextLink roundName="staker" roundType="contribute" itemName={name} projectName={project.name.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "")} />
    )
  else if (name.toLowerCase().includes('whitelist')
    && name.toLowerCase().includes('strategic')
    && activeRounds.some(attr => (
      attr.projectName.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") ===
      project.name.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") &&
      attr.roundName.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") === "strategic") &&
      attr.title.toLowerCase().includes('whitelist' || 'white list' || 'white-list')
    ))
    return (
      <ButtonNextLink roundName="strategic" roundType="whitelist" itemName={name} projectName={project.name.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "")} />
    )
  else if (name.toLowerCase().includes('contribution')
    && name.toLowerCase().includes('strategic')
    && activeRounds.some(attr => (
      attr.projectName.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") ===
      project.name.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") &&
      attr.roundName.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "") === "strategic") &&
      attr.title.toLowerCase().includes('contribution')
    )) return (
      <ButtonNextLink roundName="strategic" roundType="contribute" itemName={name} projectName={project.name.toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "")} />
    )
  else if (name.toLowerCase().includes('ido')) return (
    <ButtonNextLink roundName="" roundType="" itemName={name} projectName="" link="https://app.spectrum.fi/ergo/swap" />
  )
  else return (
    <ButtonNextLink roundName="" roundType="" itemName={name} projectName="" disabled />
  )
}

const ActiveRound = ({ projects, isLoading }) => {
  const [included, setIncluded] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeRounds, setActiveRounds] = useState([]);
  const { whiteListProjectsActive, isLoading: whiteListProjectsIsLoading } =
    useWhitelistProjects();
  const {
    contributionProjectsActive, isLoading: contributionProjectsIsLoading,
  } = useContributionProjects();

  const checkProject = (project) => {
    return included.includes(project.name?.toLowerCase().replaceAll(" ", "").replaceAll(/[^a-zA-Z0-9]/g, ""))
  }

  useEffect(() => {
    if (projects?.length !== 0) {
      contributionProjectsActive?.map((project) => {
        setIncluded(previous => [...previous, project.projectName.toLowerCase()])
        setActiveRounds(previous => [...previous, project])
      })
      whiteListProjectsActive?.map((project) => {
        setIncluded(previous => [...previous, project.projectName.toLowerCase()])
        setActiveRounds(previous => [...previous, project])
      })
    }
    console.log(included)
  }, [projects]);

  useEffect(() => {
    console.log(included)
    if (projects?.length !== 0) {
      setFilteredProjects(projects?.filter(project => checkProject(project)))
    }
  }, [included]);

  return (
    <>
      {filteredProjects && filteredProjects.length !== 0 && (
        <>
          <Typography variant="h2" sx={{ mt: 0, mb: '48px', textAlign: 'center' }}>Active IDOs</Typography>
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
          {filteredProjects.map((project) => {
            return (
              <Grid
                container
                key={project.id}
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={6}
                sx={{
                  mb: '80px',
                }}
              >
                <Grid item md={6} xs={12}>
                  <Paper
                    sx={{
                      p: '24px',
                      // height: '100%',
                    }}
                  >
                    <Grid
                      container
                      direction="column"
                      justifyContent="space-between"
                      sx={{ height: '100%' }}
                    >
                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center"
                          spacing={2}
                          sx={{ mb: '24px', }}
                        >
                          <Grid item>
                            <Box sx={{
                              width: '80px',
                              height: '80px',
                            }}
                            >
                              <Image src={project.bannerImgUrl} alt="" layout="responsive" width={512} height={512} />
                            </Box>
                          </Grid>
                          <Grid item>
                            <Typography gutterBottom variant="h3" component="span">
                              {project.name}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Divider sx={{ mb: '24px' }} />


                      </Grid>
                      <Grid item>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: '24px' }}>
                          {project.shortDescription}
                        </Typography>
                        <Link
                          href={"/projects/" +
                            project.name
                              .toLowerCase()
                              .replaceAll(" ", "")
                              .replaceAll(/[^a-zA-Z0-9]/g, "")}
                          passHref>
                          <Button sx={{ float: 'right' }}>
                            Learn More
                          </Button>
                        </Link>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item md={6} xs={12}>


                  {project.roadmap.roadmap.map((item, i) => (
                    <Grid container key={i} sx={{ mb: '24px' }}>
                      <Grid item xs={2}>
                        <Typography sx={{ fontSize: '.875rem' }}>
                          {months[parseInt(item.date.slice(5, 7))]}
                        </Typography>
                        <Typography sx={{ fontSize: '2.25rem', lineHeight: 0.7 }}>
                          {item.date.slice(8, 10)}
                        </Typography>
                      </Grid>
                      <Grid item xs={10}>
                        <CheckButtonType name={item.name} activeRounds={activeRounds} project={project} />
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )
          })
          }
          <Divider sx={{ mb: 10 }} />
        </>
      )}
    </>
  );
};

export default ActiveRound;