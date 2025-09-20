import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import dns from "dns";
import https from "https";

// Force IPv4 resolution
dns.setDefaultResultOrder("ipv4first");
const ipv4Agent = new https.Agent({ family: 4 });

export const validateDockerImage = async (req, res, next) => {
  try {
    const { dockerImage, imageType, dockerhubPAT } = req.body;

    if (dockerImage && imageType === "public") {
      const link = `https://hub.docker.com/v2/repositories/${dockerImage}`;
      console.log("Checking public docker image:", link);

      try {
        const response = await axios.get(link, {
          httpsAgent: ipv4Agent,   // 👈 force IPv4
          timeout: 10000,
        });
        console.log("Image found:", response.data?.name);
      } catch (err) {
        if (err.response) {
          console.error("Docker Hub API error:", err.response.status, err.response.data);

          if (err.response.status === 404) {
            throw new ApiError(404, `Docker image ${dockerImage} not found`);
          } else if (err.response.status === 429) {
            throw new ApiError(429, "Rate limit exceeded on Docker Hub API");
          } else {
            throw new ApiError(err.response.status, `Docker Hub error: ${err.response.statusText}`);
          }
        } else if (err.request) {
          console.error("No response received from Docker Hub:", err.message || err.code);
          throw new ApiError(503, "Docker Hub not reachable (network issue)");
        } else {
          console.error("Unexpected error:", err.message);
          throw new ApiError(500, "Unexpected error: " + err.message);
        }
      }
    }

    if (dockerImage && imageType === "private") {
      const [registry, imageName] = dockerImage.split("/");
      const link = `https://hub.docker.com/v2/repositories/${registry}/${imageName}`;
      console.log("Checking private docker image:", link);

      try {
        const response = await axios.get(link, {
          httpsAgent: ipv4Agent,   // 👈 yahan bhi
          headers: { Authorization: `Bearer ${dockerhubPAT}` },
          timeout: 10000,
        });
        console.log("Private image found:", response.data?.name);
      } catch (err) {
        console.error("Private image error:", err.message);
        throw new ApiError(404, `Docker image ${dockerImage} not found`);
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};
