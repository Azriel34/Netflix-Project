package com.example.netflix_android.database;

import android.app.Application;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.example.netflix_android.model.Movie;
import com.example.netflix_android.model.MovieEntity;
import com.example.netflix_android.network.ApiService;
import com.example.netflix_android.network.RetrofitInstance;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MovieRepository {
    private final MovieDao movieDao;
    private final LiveData<List<MovieEntity>> allMovies;
    private final ExecutorService executorService;
    private final ApiService apiService;

    public MovieRepository(Application application) {
        AppDatabase db = AppDatabase.getDatabase(application);
        movieDao = db.movieDao();
        allMovies = movieDao.getAllMovies();
        executorService = Executors.newSingleThreadExecutor();
        apiService = RetrofitInstance.getRetrofitInstance().create(ApiService.class);
    }

    public LiveData<List<MovieEntity>> getAllMovies() {
        return allMovies;
    }

    public LiveData<MovieEntity> getMovieByIdFromLocal(String id) {
        return movieDao.getMovieById(id);
    }

    public LiveData<Movie> getMovieByIdFromServer(String id) {
        MutableLiveData<Movie> movieLiveData = new MutableLiveData<>();
        apiService.getMovie(id).enqueue(new Callback<Movie>() {
            @Override
            public void onResponse(Call<Movie> call, Response<Movie> response) {
                if (response.isSuccessful() && response.body() != null) {
                    movieLiveData.postValue(response.body());
                }
            }

            @Override
            public void onFailure(Call<Movie> call, Throwable t) {
                movieLiveData.postValue(null);
            }
        });
        return movieLiveData;
    }

    public void insert(MovieEntity movie) {
        executorService.execute(() -> movieDao.insertMovie(movie));
    }

}