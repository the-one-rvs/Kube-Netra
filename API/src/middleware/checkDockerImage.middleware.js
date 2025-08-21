import axios from "axios";
import { ApiError } from "../utils/ApiError.js";

export const validateDockerImage = async (req, res, next) => {
    try {
        const {
            dockerImage,
            imageType,
            dockerhubPAT,
        } = req.body

        if (dockerImage && imageType === "public") {
            const [registry, imageName] = dockerImage.split("/");
            // const [repo, tag = "latest"] = imageName.split(":");

            try {
                await axios.get(
                    `https://hub.docker.com/v2/repositories/${registry}/${imageName}`
                );
            } catch (err) {
                throw new ApiError(404, `Docker image ${dockerImage} not found`);
            }
        }

        if (dockerImage && imageType === "private") {
            const [registry, imageName] = dockerImage.split("/");
            // const [repo, tag = "latest"] = imageName.split(":");

            try {
                await axios.get(
                    `https://hub.docker.com/v2/repositories/${registry}/${imageName}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${dockerhubPAT}`
                        }
                    }
                );
            } catch (err) {
                throw new ApiError(404, `Docker image ${dockerImage} not found`);
            }
        }

        next();
    } catch (err) {
        next(err);
    }
};
