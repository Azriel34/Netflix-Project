package com.example.netflix_android.model;

import androidx.room.Entity;

@Entity(tableName = "categories")
public class CategoryEntity {
    private String id;
    private String name;

    private boolean promoted;

    public CategoryEntity(String id, String name, boolean promoted) {
        this.id = id;
        this.name = name;
        this.promoted = promoted;
    }


    public CategoryEntity() {
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean getPromoted() { return promoted;}

    public void setPromoted(boolean bool) {this.promoted = bool;}
}


