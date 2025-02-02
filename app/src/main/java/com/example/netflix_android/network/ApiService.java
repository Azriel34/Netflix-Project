package com.example.netflix_android.network;


import com.example.netflix_android.model.Movie;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface ApiService {
    @GET("/movies/{id}")
    Call<Movie> getMovie(@Path("id") String movieId);
}