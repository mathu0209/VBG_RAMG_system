package com.mgnregs.service;

import com.mgnregs.entity.Project;
import com.mgnregs.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Project createProject(Project project) {
        if (project.getProjectCode() == null || project.getProjectCode().isEmpty()) {
            project.setProjectCode("PRJ-" + (System.currentTimeMillis() % 100000));
        }
        return projectRepository.save(project);
    }

    public Project updateStatus(Long id, String status) {
        Project p = projectRepository.findById(id).orElseThrow();
        p.setStatus(status);
        return projectRepository.save(p);
    }
}
