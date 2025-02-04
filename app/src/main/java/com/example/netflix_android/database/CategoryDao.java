package com.example.netflix_android.database;


import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;

import com.example.netflix_android.model.*;
import com.example.netflix_android.model.CategoryEntity;

import java.util.List;
@Dao
public interface CategoryDao {
    @Insert
    void insertCategory(CategoryEntity category);

    @Query("SELECT * FROM categories WHERE id = :categoryId")
    LiveData <CategoryEntity> getCategoryById(String categoryId);

    @Query("DELETE  FROM categories WHERE id = :categoryId")
    void deletetCategory(String categoryId);



    @Query("SELECT * FROM movies")
    LiveData<List<CategoryEntity>> getAllCategories();
}

