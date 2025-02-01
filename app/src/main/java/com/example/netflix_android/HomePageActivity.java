package com.example.netflix_android;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class HomePageActivity extends AppCompatActivity {
    private EditText usernameInput;
    private TextView errorText;
    private Button getStartedButton;
    private Button signInButton;
    private static final String BASE_URL = "http://10.0.2.2:"; // Use 10.0.2.2 for localhost in Android emulator
    private static final String PORT = "3000"; // Replace with your port number

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_home_page);

        // Initialize views
        initializeViews();

        // Set up window insets
        setupWindowInsets();

        // Set up click listeners
        setupListeners();
    }
    public void checkUserExists(String userName) {
        OkHttpClient client = new OkHttpClient();
        String url = "http://10.0.2.2:3001/api/users/exists"; // Change to your backend

        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("userName", userName);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        RequestBody body = RequestBody.create(jsonObject.toString(), MediaType.get("application/json; charset=utf-8"));

        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();

        client.newCall(request).enqueue(new Callback() {
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    String responseData = response.body().string();
                    try {
                        JSONObject jsonResponse = new JSONObject(responseData);
                        boolean userExists = jsonResponse.getBoolean("exists");

                        Intent intent;
                        if (userExists) {
                            intent = new Intent(HomePageActivity.this, LoginActivity.class);
                        } else {
                            intent = new Intent(HomePageActivity.this, RegisterActivity.class);
                        }
                        intent.putExtra("userName", userName);
                        startActivity(intent);

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }

    private void initializeViews() {
        usernameInput = findViewById(R.id.usernameInput);
        errorText = findViewById(R.id.errorText);
        getStartedButton = findViewById(R.id.getStartedButton);
        signInButton = findViewById(R.id.signInButton);

        // Initially hide error text
        errorText.setVisibility(View.GONE);
    }

    private void setupWindowInsets() {
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.homepage), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    private void setupListeners() {
        signInButton.setOnClickListener(v -> {
            Intent intent = new Intent(HomePageActivity.this, LoginActivity.class);
            startActivity(intent);
        });

        getStartedButton.setOnClickListener(v -> handleGetStarted());
    }

    private void handleGetStarted() {
        String username = usernameInput.getText().toString().trim();

        // Validate username
        if (TextUtils.isEmpty(username) || username.length() < 4 || username.length() > 20) {
            showError("Username must be between 4 and 20 characters.");
            return;
        }

        // Clear any previous errors
        errorText.setVisibility(View.GONE);

        // Check if username exists
        checkUserExists(username);
    }

    private void navigateToNextScreen(String username, boolean exists) {
        Intent intent;
        if (exists) {
            intent = new Intent(HomePageActivity.this, LoginActivity.class);
        } else {
            intent = new Intent(HomePageActivity.this, RegisterActivity.class);
        }

        intent.putExtra("userName", username);
        startActivity(intent);
    }

    private void showError(String message) {
        errorText.setText(message);
        errorText.setVisibility(View.VISIBLE);
    }
}
