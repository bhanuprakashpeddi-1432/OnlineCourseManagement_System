package com.coursemanagement.dto;

import jakarta.validation.constraints.NotBlank;

public class LessonRequest {
    @NotBlank
    private String title;

    private String content;
    private String videoUrl;
    private Integer order;

    // Constructors
    public LessonRequest() {}

    public LessonRequest(String title, String content, String videoUrl, Integer order) {
        this.title = title;
        this.content = content;
        this.videoUrl = videoUrl;
        this.order = order;
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public Integer getOrder() { return order; }
    public void setOrder(Integer order) { this.order = order; }
}
