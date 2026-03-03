package com.nexorcrm.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    @Size(max = 200, message = "Project name must be at most 200 characters")
    private String projectName;

    @NotBlank(message = "Project location is required")
    @Size(max = 200, message = "Project location must be at most 200 characters")
    private String projectLocation;

    @NotBlank(message = "Project type is required")
    @Size(max = 160, message = "Project type must be at most 160 characters")
    private String projectType;

    @NotBlank(message = "Project status is required")
    @Size(max = 160, message = "Project status must be at most 160 characters")
    private String projectStatus;

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectLocation() {
        return projectLocation;
    }

    public void setProjectLocation(String projectLocation) {
        this.projectLocation = projectLocation;
    }

    public String getProjectType() {
        return projectType;
    }

    public void setProjectType(String projectType) {
        this.projectType = projectType;
    }

    public String getProjectStatus() {
        return projectStatus;
    }

    public void setProjectStatus(String projectStatus) {
        this.projectStatus = projectStatus;
    }
}
