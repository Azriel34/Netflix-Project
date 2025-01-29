package com.example.netflix_android;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.android.material.textfield.TextInputLayout;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class LoginActivity extends AppCompatActivity {
    private EditText usernameInput;
    private EditText passwordInput;
    private TextInputLayout usernameLayout;
    private TextInputLayout passwordLayout;
    private Button signInButton;
    private TextView errorText;
    private ProgressBar progressBar;
    private ImageView togglePasswordVisibility;
    private TextView signUpLink;
    private boolean isPasswordVisible = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_login);

        // Initialize views
        initializeViews();

        // Set up window insets
        setupWindowInsets();

        // Set up click listeners and validation
        setupListeners();

        // Check for username from intent
        checkForUsername();
    }

    private void initializeViews() {
        usernameInput = findViewById(R.id.usernameInput);
        passwordInput = findViewById(R.id.passwordInput);
        usernameLayout = findViewById(R.id.usernameLayout);
        passwordLayout = findViewById(R.id.passwordLayout);
        signInButton = findViewById(R.id.signInButton);
        errorText = findViewById(R.id.errorText);
        progressBar = findViewById(R.id.progressBar);
        signUpLink = findViewById(R.id.signUpLink);
    }

    private void setupWindowInsets() {
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.login), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    private void setupListeners() {
        signInButton.setOnClickListener(v -> validateAndLogin());

        signUpLink.setOnClickListener(v -> {
            Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
            startActivity(intent);
        });

        usernameInput.setOnFocusChangeListener((v, hasFocus) -> {
            if (!hasFocus) {
                validateUsername();
            }
        });

        passwordInput.setOnFocusChangeListener((v, hasFocus) -> {
            if (!hasFocus) {
                validatePassword();
            }
        });
    }

    private void checkForUsername() {
        String username = getIntent().getStringExtra("userName");
        if (!TextUtils.isEmpty(username)) {
            usernameInput.setText(username);
        }
    }

    private boolean validateUsername() {
        String username = usernameInput.getText().toString().trim();
        if (username.length() < 4 || username.length() > 20) {
            usernameLayout.setError("Your username must contain between 4 and 20 characters.");
            return false;
        }
        usernameLayout.setError(null);
        return true;
    }

    private boolean validatePassword() {
        String password = passwordInput.getText().toString();
        if (password.length() < 4 || password.length() > 60) {
            passwordLayout.setError("Your password must contain between 4 and 60 characters.");
            return false;
        }
        passwordLayout.setError(null);
        return true;
    }

    public void loginUser(String userName, String password) {
        OkHttpClient client = new OkHttpClient();
        String url = "http://10.0.0.2:4000/api/tokens/"; // Adjust to your backend port

        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("userName", userName);
            jsonObject.put("passWord", password);
        } catch (JSONException e) {
            e.printStackTrace();
            return;
        }

        RequestBody body = RequestBody.create(jsonObject.toString(), MediaType.get("application/json; charset=utf-8"));

        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
                runOnUiThread(() ->
                        Toast.makeText(LoginActivity.this, "Login failed. Please try again.", Toast.LENGTH_LONG).show()
                );
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    String responseData = response.body().string();
                    try {
                        JSONObject jsonResponse = new JSONObject(responseData);
                        String token = jsonResponse.getString("token");

                        // Navigate to home screen with JWT token
                        runOnUiThread(() ->
                                Toast.makeText(LoginActivity.this, "Login success.", Toast.LENGTH_LONG).show()
                        );
                        /*
                        Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
                        intent.putExtra("jwt", token);
                        startActivity(intent);
                        finish();
                        */
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                } else {
                    runOnUiThread(() ->
                            Toast.makeText(LoginActivity.this, "Invalid username or password.", Toast.LENGTH_LONG).show()
                    );
                }
            }
        });
    }


    private void validateAndLogin() {
        if (!validateUsername() || !validatePassword()) {
            return;
        }

        String username = usernameInput.getText().toString().trim();
        String password = passwordInput.getText().toString();

        // Show progress and disable button
        progressBar.setVisibility(View.VISIBLE);
        signInButton.setEnabled(false);

        loginUser(username, password);
        progressBar.setVisibility(View.INVISIBLE);
        signInButton.setEnabled(true);
    }

    private void showError(String message) {
        errorText.setText(message);
        errorText.setVisibility(View.VISIBLE);
    }
}