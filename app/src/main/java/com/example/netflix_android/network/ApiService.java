package com.example.netflix_android.network;

import android.util.Log;

import com.example.netflix_android.model.MovieEntity;
import com.example.netflix_android.model.CategoryEntity;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Path;

public interface ApiService {

    @GET("movies/{id}")
    Call<MovieEntity> getMovie(@Path("id") String movieId);


    @Multipart
    @POST("movies/")
    Call<Void> createMovie(
            @Part("name") RequestBody name,
            @Part("description") RequestBody description,
            @Part("categories") RequestBody categories,
            @Part MultipartBody.Part video,
            @Part MultipartBody.Part poster
    );

    @PATCH("movies/{id}")
    Call<Void> editMovie(@Path("id") String movieId, @Body MovieEntity movie);

    @DELETE("movies/{id}")
    Call<Void> deleteMovie(@Path("id") String movieId);



    @POST("categories/")
    Call<Void> createCategory(
            @Body CategoryEntity category
    );

    @GET("categories/{id}")
    Call<CategoryEntity> getCategory(@Path("id") String categoryId);

    @PATCH("categories/{id}")
    Call<Void> editCategory(@Path("id") String categoryId, @Body CategoryEntity category);

    @DELETE("categories/{id}")
    Call<Void> deleteCategory(@Path("id") String categoryId);
}
