package com.example.netflix_android.model;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;


@Entity(tableName = "categories")
public class CategoryEntity {
    @PrimaryKey
    @NonNull
    private String id;
    private String name;

    private boolean promoted;

    public CategoryEntity(String id, String name, boolean promoted) {
        this.id = id;
        this.name = name;
        this.promoted = promoted;
    }

    public CategoryEntity( String name, boolean promoted) {
        this.name = name;
        this.promoted = promoted;
    }


    public CategoryEntity() {
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
         this.id = id;
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


