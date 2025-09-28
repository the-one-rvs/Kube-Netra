import { GithubPAT } from "../models/githubPAT.model.js";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addPAT = asyncHandler(async(req, res) => {
    try {
        
        const {nameOfPAT, githubUsername, githubPAT} = req.body

        if (!nameOfPAT || !githubUsername || !githubPAT) {
            throw new ApiError(404, "All fields are required")
        }

        if (!req.user) {
            throw new ApiError(404, "Unauthorized request")
        }

        const pat = await GithubPAT.create({
            nameOfPAT: nameOfPAT,
            githubUsername: githubUsername,
            githubPAT: githubPAT
        })

        return res
        .status(200)
        .json(new ApiResponse(200, {}, "PAT added successfully"))

    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const addPATinProject = asyncHandler(async(req, res) => {
    try {
        
        const { projectId, nameOfPAT } = req.body

        if (!req.user ) {
            throw new ApiError(400, "Unauthorized request")
        }

        if (!nameOfPAT) {
            throw new ApiError(400, "PAT name is required")
        }

        const githubPAT = await GithubPAT.findOne({ nameOfPAT: nameOfPAT })
        if (!githubPAT) {
            throw new ApiError(400, "PAT not found")
        }

        githubPAT.projects.push(projectId)
        await githubPAT.save()

        const project = await Project.findById(projectId).select("-dockerhubPAT")
        project.nameOfGithubPAT = nameOfPAT
        await project.save()

        return res
        .status(200)
        .json(new ApiResponse(200, project, "PAT added to project successfully"))
    }

    catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const showPATDetails = asyncHandler(async (req, res) => {
  try {
    if (!req.user) throw new ApiError(401, "Unauthorized request");

    const { patId } = req.params;
    if (!patId) throw new ApiError(400, "PAT ID not provided");

    const pat = await GithubPAT.findById(patId).select("-githubPAT").lean();
    if (!pat) throw new ApiError(404, "PAT not found");

    // Fetch projects safely
    const allProjects = await Promise.all(
      pat.projects.map(async (projectId) => {
        const project = await Project.findById(projectId).lean();
        if (!project) return null; // agar project deleted ho gaya
        return {
          _id: project._id,
          name: project.name || "Unnamed Project",
          dockerImage: project.dockerImage || "N/A",
          poolInterval: project.poolInterval || "N/A",
        };
      })
    );

    // Filter out nulls (missing projects)
    const filteredProjects = allProjects.filter((proj) => proj !== null);

    const newInformation = {
      ...pat,
      projects: filteredProjects,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, newInformation, "PAT found successfully"));
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to fetch PAT details");
  }
});

const deletePAT = asyncHandler(async(req, res) => {
    try {
      const {patId} = req.params

      if (!req.user) {
          throw new ApiError(404, "Unauthorized request")
      }

      if (!patId) {
          throw new ApiError(400, "PAT ID not found")
      }

      const pat = await GithubPAT.findById(patId).select("-githubPAT")
      if (!pat) {
          throw new ApiError(400, "PAT not found")
      }
      
      await Project.updateMany(
        { _id: { $in: pat.projects } },   
        { $pull: { nameOfGithubPAT: pat.nameOfPAT } }  
      );
      await GithubPAT.findByIdAndDelete(patId)
      return res
      .status(200)
      .json ( new ApiResponse(200, pat, "PAT Deleted"))
      
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const showAllPats = asyncHandler(async(req, res) => {
    try {
        
        if (!req.user) {
            throw new ApiError(400, "Unauthorized request")
        }

        const pats = await GithubPAT.find().select("-githubPAT")

        return res.status(200).json(new ApiResponse(200, pats, "Pats found successfully"))

    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const showNonPATProjects = asyncHandler(async (req, res) => {
  try {
    // Check user authentication
    if (!req.user) {
      throw new ApiError(401, "Unauthorized request");
    }

    
    const projects = await Project.find().select("-dockerhubPAT").lean();

    
    const filteredProjects = projects.filter(
      (project) => !project.nameOfGithubPAT
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        filteredProjects,
        "Non-PAT projects found successfully"
      )
    );
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to fetch projects");
  }
})

const removePATFromProject = asyncHandler(async (req, res) => {
  const { patId, projectId } = req.body;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized request");
  }

  if (!patId || !projectId) {
    throw new ApiError(400, "patId and projectId are required");
  }

  try {
    // 1. Project se PAT unlink karo
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $unset: { nameOfGithubPAT: 1 } },  // ❌ field remove karne ke liye
      // agar blank string chahiye toh { $set: { nameOfGithubPAT: "" } }
      { new: true }
    ).select("-dockerhubPAT");

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // 2. PAT se project remove karo
    await GithubPAT.findByIdAndUpdate(
      patId,
      { $pull: { projects: projectId } },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, project, "PAT removed from project successfully"));
  } catch (error) {
    console.error("❌ Error in removePATFromProject:", error);
    throw new ApiError(500, error?.message || "Failed to remove PAT from project");
  }
});


export {
    addPAT,
    addPATinProject,
    showPATDetails,
    deletePAT,
    showAllPats,
    showNonPATProjects,
    removePATFromProject
}