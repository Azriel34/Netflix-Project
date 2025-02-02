package com.example.netflix_android;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import android.content.Intent;
import android.widget.Button;
import android.widget.EditText;

public class MainActivity extends AppCompatActivity {

    public class MainActivity extends AppCompatActivity {

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);

            EditText movieIdEditText = findViewById(R.id.movieIdEditText);
            Button nextPageButton = findViewById(R.id.nextPageButton);

            nextPageButton.setOnClickListener(v -> {
                String movieId = movieIdEditText.getText().toString();
                if (!movieId.isEmpty()) {
                    Intent intent = new Intent(MainActivity.this, MovieDetailActivity.class);
                    intent.putExtra("movie_id", movieId);
                    startActivity(intent);
                } else {
                    movieIdEditText.setError("Please enter a valid movie ID");
                }
            });
        }
    }