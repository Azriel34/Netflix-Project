package com.example.netflix_android.pages;

import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.netflix_android.R;

public class MovieWatchActivity extends AppCompatActivity {
    private WebView movieWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_watch);


        movieWebView = findViewById(R.id.movieWebView);


        int movieId = getIntent().getIntExtra("movie_id", -1);

        if (movieId != -1) {

            String videoUrl = "http://localhost:5000/api/movies/" + movieId + "/file";


            WebSettings webSettings = movieWebView.getSettings();
            webSettings.setJavaScriptEnabled(true);
            movieWebView.setWebChromeClient(new WebChromeClient());
            movieWebView.loadUrl(videoUrl);
        }
    }
}
