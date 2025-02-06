package com.example.netflix_android.database;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;

import com.example.netflix_android.model.*;
import com.example.netflix_android.model.MovieEntity;

import java.util.List;

@Dao
public interface MovieDao {

    @Insert
    void insertMovie(MovieEntity movieEntity);

    @Query("SELECT * FROM movies WHERE id = :movieId")
    LiveData <MovieEntity> getMovieById(String movieId);

    @Query("DELETE  FROM movies WHERE id = :movieId")
    void deleteMovie(String movieId);



    @Query("SELECT * FROM movies")
    LiveData<List<MovieEntity>> getAllMovies();
}
