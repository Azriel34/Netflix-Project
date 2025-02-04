package com.example.netflix_android.database;

import android.app.Application;
import android.content.Context;
import android.net.Uri;
import android.text.TextUtils;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
//import com.example.netflix_android.model.Movie;
import com.example.netflix_android.model.MovieEntity;
import com.example.netflix_android.network.ApiService;
import com.example.netflix_android.network.RetrofitInstance;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
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

    public LiveData<MovieEntity> getMovieByIdFromServer(String id) {
        MutableLiveData<MovieEntity> movieLiveData = new MutableLiveData<>();
        apiService.getMovie(id).enqueue(new Callback<MovieEntity>() {
            @Override
            public void onResponse(Call<MovieEntity> call, Response<MovieEntity> response) {
                if (response.isSuccessful() && response.body() != null) {
                    movieLiveData.postValue(response.body());
                }
            }

            @Override
            public void onFailure(Call<MovieEntity> call, Throwable t) {
                movieLiveData.postValue(null);
            }
        });
        return movieLiveData;
    }

    public void insert(MovieEntity movie) {
        executorService.execute(() -> movieDao.insertMovie(movie));
    }


    public void fetchAndSaveMovieIfNotExist(String id, MutableLiveData<MovieEntity> movieLiveData) {
        //check whether movie exsist in the room
        getMovieByIdFromLocal(id).observeForever(localMovie -> {
            if (localMovie != null) {
                //if movie exsist in the room-update the live data
                movieLiveData.postValue(localMovie);
            } else {
                //else-bring the data from the api
                getMovieByIdFromServer(id).observeForever(remoteMovie -> {
                    if (remoteMovie != null) {
                        //create local room entity accroding to the api entity data

                        MovieEntity movieEntity = new MovieEntity(
                                remoteMovie.getId(),
                                remoteMovie.getName(),
                                remoteMovie.getDescription(),
                                remoteMovie.getCategories(),
                                remoteMovie.getPath(),
                                remoteMovie.getPoster()
                        );

                        //after creation-add it to the room
                        insert(movieEntity);

                       //update the livedata
                        movieLiveData.postValue(movieEntity);
                    }
                });
            }
        });
    }

    private File getFileFromUri(Context context, Uri uri) {
        try {
            InputStream inputStream = context.getContentResolver().openInputStream(uri);
            File tempFile = File.createTempFile("upload_", null, context.getCacheDir());
            FileOutputStream outputStream = new FileOutputStream(tempFile);

            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }

            outputStream.close();
            inputStream.close();
            return tempFile;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    //create movie
    public void createMovie(MovieEntity movie, MutableLiveData<Boolean> operationSuccess, Context context) {
        RequestBody name = RequestBody.create(MediaType.parse("text/plain"), movie.getName());
        RequestBody description = RequestBody.create(MediaType.parse("text/plain"), movie.getDescription());


        String categoriesString = TextUtils.join(",", movie.getCategories());
        RequestBody categoriesBody = RequestBody.create(MediaType.parse("text/plain"), categoriesString);

        MultipartBody.Part videoPart = null, posterPart = null;


        if (movie.getVideoUri() != null) {
            File videoFile = getFileFromUri(context, movie.getVideoUri());
            if (videoFile != null) {
                RequestBody videoRequestBody = RequestBody.create(MediaType.parse("video/*"), videoFile);
                videoPart = MultipartBody.Part.createFormData("video", videoFile.getName(), videoRequestBody);
            }
        }


        if (movie.getPosterUri() != null) {
            File posterFile = getFileFromUri(context, movie.getPosterUri());
            if (posterFile != null) {
                RequestBody posterRequestBody = RequestBody.create(MediaType.parse("image/*"), posterFile);
                posterPart = MultipartBody.Part.createFormData("poster", posterFile.getName(), posterRequestBody);
            }
        }

        apiService.createMovie(name, description, categoriesBody, videoPart, posterPart)
                .enqueue(new Callback<Void>() {
                    @Override
                    public void onResponse(Call<Void> call, Response<Void> response) {
                        operationSuccess.postValue(response.isSuccessful());
                    }

                    @Override
                    public void onFailure(Call<Void> call, Throwable t) {
                        operationSuccess.postValue(false);
                    }
                });
    }

    //delete movie
    public void deleteMovie(String movieId, MutableLiveData<Boolean> operationSuccess) {
        apiService.deleteMovie(movieId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                operationSuccess.postValue(response.isSuccessful());
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                operationSuccess.postValue(false);
            }
        });
    }
}
