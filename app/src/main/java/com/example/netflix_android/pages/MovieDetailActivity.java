package com.example.netflix_android.pages;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.bumptech.glide.Glide;
import com.example.netflix_android.R;
import com.example.netflix_android.viewmodel.MovieViewModel;

public class MovieDetailActivity extends AppCompatActivity {
    private TextView titleTextView, descriptionTextView;
    private ImageView posterImageView;
    private Button playMovieButton;
    private MovieViewModel movieViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_detail);


        titleTextView = findViewById(R.id.titleTextView);
        descriptionTextView = findViewById(R.id.descriptionTextView);
        posterImageView = findViewById(R.id.posterImageView);
        playMovieButton = findViewById(R.id.playMovieButton);


        String movieId = getIntent().getStringExtra("movie_id");

        if (movieId != "") {

            movieViewModel = new ViewModelProvider(this).get(MovieViewModel.class);


            movieViewModel.getMovieById(movieId).observe(this, movie -> {
                if (movie != null) {
                    titleTextView.setText(movie.getName());
                    descriptionTextView.setText(movie.getDescription());


                    String posterUrl = "http://localhost:5000/api/movies/" + movieId + "/poster";
                    Glide.with(this).load(posterUrl).into(posterImageView);
                }
            });
        }


        playMovieButton.setOnClickListener(v -> {
            Intent intent = new Intent(MovieDetailActivity.this, MovieWatchActivity.class);
            intent.putExtra("movie_id", movieId);
            startActivity(intent);
        });
    }
}
