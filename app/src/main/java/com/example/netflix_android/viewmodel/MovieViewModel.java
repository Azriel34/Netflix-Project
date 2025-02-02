package com.example.netflix_android.viewmodel;

import android.app.Application;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.example.netflix_android.database.MovieRepository;
import com.example.netflix_android.model.Movie;

import java.util.List;

public class MovieViewModel extends AndroidViewModel {
    private final MovieRepository repository;
    private final LiveData<List<Movie>> allMovies;

    public MovieViewModel(Application application) {
        super(application);
        repository = new MovieRepository(application);
        allMovies = repository.getAllMovies();
    }

    public LiveData<List<Movie>> getAllMovies() {
        return allMovies;
    }

    public LiveData<Movie> getMovieById(String id) {
        MutableLiveData<Movie> movieLiveData = new MutableLiveData<>();

        // בדוק אם הסרט כבר קיים ב-Room
        repository.getMovieByIdFromLocal(id).observeForever(movie -> {
            if (movie != null) {
                // אם הסרט קיים ב-Room, עדכן את ה-LiveData
                movieLiveData.postValue(movie);
            } else {
                // אם הסרט לא קיים ב-Room, טען אותו מה-API
                repository.getMovieByIdFromServer(id).observeForever(remoteMovie -> {
                    if (remoteMovie != null) {
                        // שמור את הסרט ב-Room ועדכן את ה-LiveData
                        repository.insert(remoteMovie);
                        movieLiveData.postValue(remoteMovie);
                    }
                });
            }
        });

        return movieLiveData;
    }

    public void insert(Movie movie) {
        repository.insert(movie);
    }

    public void deleteAll() {
        repository.deleteAll();
    }
}