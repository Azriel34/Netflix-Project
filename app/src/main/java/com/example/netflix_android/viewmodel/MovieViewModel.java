package com.example.netflix_android.viewmodel;

import android.app.Application;
import android.content.Context;
import android.net.Uri;

import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.example.netflix_android.database.MovieRepository;
import com.example.netflix_android.model.MovieEntity;

import java.util.List;


    public class MovieViewModel extends AndroidViewModel {
        private final MovieRepository movieRepository;
        private final LiveData<List<MovieEntity>> allMovies;
        private final MutableLiveData<Boolean> operationSuccess = new MutableLiveData<>();


        public MovieViewModel(Application application) {
            super(application);
            movieRepository = new MovieRepository(application);
            allMovies = movieRepository.getAllMovies();
        }

        //create movie
        public void createMovie(Context context, String name, List<String> categories, String description, Uri videoPath, Uri posterPath) {
            MovieEntity newMovie = new MovieEntity(name, description, categories,  videoPath, posterPath);
            movieRepository.createMovie(newMovie, operationSuccess, context);
        }

        //delete movie
        public void deleteMovie(String movieId) {
            movieRepository.deleteMovie(movieId, operationSuccess);
        }

        public LiveData<Boolean> getOperationSuccess() {
            return operationSuccess;
        }

        public LiveData<List<MovieEntity>> getAllMovies() {
            return allMovies;
        }

        public LiveData<MovieEntity> getMovieById(String id) {
            MutableLiveData<MovieEntity> movieLiveData = new MutableLiveData<>();

            //using the repository in order to get the movie
            movieRepository.fetchAndSaveMovieIfNotExist(id, movieLiveData);

            return movieLiveData;
        }

        public void insert(MovieEntity movie) {
            movieRepository.insert(movie);
        }



    }
