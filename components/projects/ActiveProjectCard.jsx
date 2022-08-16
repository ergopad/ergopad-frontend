import React from "react";
import { useRouter } from "next/router";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import PublicIcon from "@mui/icons-material/Public";
import ShareIcon from "@mui/icons-material/Share";
import DiscordIcon from "@components/DiscordIcon";
import Link from "@components/MuiNextLink";
import { Grid, IconButton, Typography } from "@mui/material";
import CopyToClipboard from "@components/CopyToClipboard";
import { useProjectInfo } from "../../hooks/useProjectInfo";

export const ActiveProjectCard = ({ project, type }) => {
  const router = useRouter();
  const { projectInfo, isLoading } = useProjectInfo(project.projectName);

  if (isLoading) {
    return null;
  }

  const projectLink =
    type === "whitelist"
      ? `/whitelist/${project.projectName}/${project.roundName}`
      : `/contribute/${project.projectName}/${project.roundName}`;

  return (
    <Grid item xs={12} sm={6} md={4} key={projectInfo.id}>
      <Card
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardActionArea
          onClick={() => {
            router.push(projectLink);
          }}
        >
          <CardMedia
            component="img"
            alt=""
            height="180"
            image={projectInfo.bannerImgUrl}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {project.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.subtitle}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ justifyContent: "right" }}>
          {/* socials go here */}
          {projectInfo?.socials?.discord ? (
            <Link
              sx={{ display: "flex", justifyContent: "center" }}
              href={projectInfo.socials.discord}
              aria-label="discord"
              title="Discord"
              rel="noreferrer"
              target="_blank"
            >
              <IconButton aria-label="discord">
                <DiscordIcon />
              </IconButton>
            </Link>
          ) : null}
          {projectInfo?.socials?.github ? (
            <Link
              sx={{ display: "flex", justifyContent: "center" }}
              href={projectInfo.socials.github}
              aria-label="github"
              title="GitHub"
              rel="noreferrer"
              target="_blank"
            >
              <IconButton aria-label="github">
                <GitHubIcon />
              </IconButton>
            </Link>
          ) : null}
          {projectInfo?.socials?.telegram ? (
            <Link
              sx={{ display: "flex", justifyContent: "center" }}
              href={projectInfo.socials.telegram}
              aria-label="Telegram"
              title="Telegram"
              rel="noreferrer"
              target="_blank"
            >
              <IconButton aria-label="telegram">
                <TelegramIcon />
              </IconButton>
            </Link>
          ) : null}
          {projectInfo?.socials?.twitter ? (
            <Link
              sx={{ display: "flex", justifyContent: "center" }}
              href={projectInfo.socials.twitter}
              aria-label="twitter"
              title="Twitter"
              rel="noreferrer"
              target="_blank"
            >
              <IconButton aria-label="twitter">
                <TwitterIcon />
              </IconButton>
            </Link>
          ) : null}
          {projectInfo?.socials?.website ? (
            <Link
              sx={{ display: "flex", justifyContent: "center" }}
              href={projectInfo.socials.website}
              aria-label="website"
              title="Web"
              rel="noreferrer"
              target="_blank"
            >
              <IconButton aria-label="website">
                <PublicIcon />
              </IconButton>
            </Link>
          ) : null}
          <CopyToClipboard>
            {({ copy }) => (
              <IconButton
                aria-label="share"
                onClick={() =>
                  copy(
                    window.location +
                      "/" +
                      projectInfo.name
                        .toLowerCase()
                        .replaceAll(" ", "")
                        .replaceAll(/[^a-zA-Z0-9]/g, "")
                  )
                }
              >
                <ShareIcon />
              </IconButton>
            )}
          </CopyToClipboard>
        </CardActions>
      </Card>
    </Grid>
  );
};
