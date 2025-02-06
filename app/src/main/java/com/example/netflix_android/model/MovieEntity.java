package com.example.netflix_android.model;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.Ignore;
import java.util.List;
import com.google.gson.Gson;
import androidx.room.TypeConverters;


@Entity(tableName = "movies")
public class MovieEntity {
    @PrimaryKey
    @NonNull
    private String id;
    private String name;
    private String description;
    private List<String> categories;
    private int recommendationId;


    private String path;
    private String poster;


    @Ignore
    private Uri videoUri;
    @Ignore
    private Uri posterUri;

    // constructor for getting new movie from api server
    public MovieEntity(String id, String name, String description, List categories, String path, String poster) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.categories = categories;
        this.path = path;
        this.poster = poster;
    }

    // constructor for create and send new movie to the api server
    @Ignore
    public MovieEntity(String name, String description, List<String> categories, Uri videoUri, Uri posterUri) {
        this.name = name;
        this.description = description;
        this.categories = categories;
        this.videoUri = videoUri;
        this.posterUri = posterUri;
    }


    public MovieEntity() {}

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getCategories() {
        return categories;
    }
    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public int getRecommendationId() { return recommendationId; }
    public void setRecommendationId(int recommendationId) { this.recommendationId = recommendationId; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public String getPoster() { return poster; }
    public void setPoster(String poster) { this.poster = poster; }


    public Uri getVideoUri() {
        if (videoUri != null) return videoUri;
        return path != null ? Uri.parse(path) : null;
    }

    public void setVideoUri(Uri videoUri) { this.videoUri = videoUri; }

    public Uri getPosterUri() {
        if (posterUri != null) return posterUri;
        return poster != null ? Uri.parse(poster) : null;
    }

    public void setPosterUri(Uri posterUri) { this.posterUri = posterUri; }
}
