package com.example.netflix_android.pages;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.netflix_android.MovieAdapter;
import com.example.netflix_android.R;
import com.example.netflix_android.model.MovieEntity;
import com.example.netflix_android.network.ApiService;
import com.example.netflix_android.network.RetrofitInstance;
import com.example.netflix_android.viewmodel.MovieViewModel;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Call;

public class MovieDetailActivity extends AppCompatActivity {
    private TextView titleTextView, descriptionTextView;
    private ImageView posterImageView;
    private Button playMovieButton;
    private MovieViewModel movieViewModel;
    private RecyclerView recommendedMoviesRecyclerView;
    private MovieAdapter movieAdapter;
    private List<MovieEntity> recommendedMovies = new ArrayList<>();


    private void fetchRecommendedMovies(String movieId) {
        ApiService apiService = RetrofitInstance.getRetrofitInstance().create(ApiService.class);
        Call<List<MovieEntity>> call = apiService.getRecommendedMovies(movieId);

        call.enqueue(new Callback<List<MovieEntity>>() {
            @Override
            public void onResponse(Call<List<MovieEntity>> call, Response<List<MovieEntity>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    recommendedMovies.clear();
                    recommendedMovies.addAll(response.body());
                    movieAdapter.notifyDataSetChanged();
                } else {
                    Log.e("Recommendations", "Failed to fetch recommendations: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<List<MovieEntity>> call, Throwable t) {
                Log.e("Recommendations", "Error: " + t.getMessage());
            }
        });
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_detail);


        titleTextView = findViewById(R.id.titleTextView);
        descriptionTextView = findViewById(R.id.descriptionTextView);
        posterImageView = findViewById(R.id.posterImageView);
        playMovieButton = findViewById(R.id.playMovieButton);

        recommendedMoviesRecyclerView = findViewById(R.id.recommendedMoviesRecyclerView);
        recommendedMoviesRecyclerView.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));


        movieAdapter = new MovieAdapter(this, recommendedMovies);
        recommendedMoviesRecyclerView.setAdapter(movieAdapter);



        String movieId = getIntent().getStringExtra("movie_id");

        if (movieId != null && !movieId.isEmpty()) {

            movieViewModel = new ViewModelProvider(this).get(MovieViewModel.class);


            movieViewModel.getMovieById(movieId).observe(this, movie -> {
                if (movie != null) {
                    titleTextView.setText(movie.getName());
                    descriptionTextView.setText(movie.getDescription());


                    String posterUrl = "http://localhost:5000/api/movies/" + movieId + "/poster";
                    Glide.with(this).load(posterUrl).into(posterImageView);
                }
                fetchRecommendedMovies(movieId);

            });

        }

        playMovieButton.setOnClickListener(v -> {
            ApiService apiService = RetrofitInstance.getRetrofitInstance().create(ApiService.class);
            Call<Void> call = apiService.watchedMovie(movieId);
            call.enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    if (response.isSuccessful()) {
                        Log.d("WatchedMovie", "add to wacth list sent successfully!");
                    } else {
                        Log.e("WatchedMovie", "Failed to add to wacth list: " + response.code());
                    }
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    Log.e("WatchedMovie", "Error: " + t.getMessage());
                }
            });

            Intent intent = new Intent(MovieDetailActivity.this, MovieWatchActivity.class);
            intent.putExtra("movie_id", movieId);
            startActivity(intent);
        });
    }
}
