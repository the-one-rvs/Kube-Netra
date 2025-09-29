import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { GithubPAT } from "../models/githubPAT.model.js";


export const validateGitHubRepo = async (req, res, next) => {
    try {
        const {
            gitRepo,
            helmValuePath,
            branch
        } = req.body
        if (!req.project) {
            throw new ApiError(400, "Unauthorized request Unable to find project")
        }

        const project = req.project;

        const githubPATresult = await GithubPAT.findOne({ nameOfPAT: project.nameOfGithubPAT });

        if (!githubPATresult) {
            throw new ApiError(400, "Unauthorized request Project does not have any githubPAT")
        }

        const githubPAT = githubPATresult.githubPAT;

        if (!gitRepo) {
            throw new ApiError(400, "Git repo is required");
        }

        let gitRepoName = gitRepo.replace("https://github.com/", "");

        if (gitRepoName && branch) {
            const headers = {};
            if (githubPAT) {
                headers["Authorization"] = `token ${githubPAT}`;
            }

            try {
                await axios.get(`https://api.github.com/repos/${gitRepoName}`, { headers });
            } catch (err) {
                throw new ApiError(404, `GitHub repo ${gitRepoName} not found`);
            }

            try {
                await axios.get(
                    `https://api.github.com/repos/${gitRepoName}/branches/${branch}`,
                    { headers }
                );
            } catch (err) {
                throw new ApiError(404, `Branch ${branch} not found in ${gitRepoName}`);
            }

            if (helmValuePath) {
                try {
                    await axios.get(
                        `https://api.github.com/repos/${gitRepoName}/contents/${helmValuePath}`,
                        { headers }
                    );
                } catch (err) {
                    throw new ApiError(404, `Helm values path ${helmValuePath} not found in ${gitRepoName}`);
                }
            }
        }

        next();
    } catch (err) {
        next(err);
    }
};
