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


        String movieId = getIntent().getStringExtra("movie_id");
       // String movieId = "67a4a32ca4e8bd32e76ba4cc";
        if (movieId != null) {

            String videoUrl = "http://10.0.2.2:5000/api/movies/" + movieId + "/file";


            WebSettings webSettings = movieWebView.getSettings();
            webSettings.setJavaScriptEnabled(true);
            movieWebView.setWebChromeClient(new WebChromeClient());
            movieWebView.loadUrl(videoUrl);
        }
    }
}
