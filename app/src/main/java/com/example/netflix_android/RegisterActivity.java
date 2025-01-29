package com.example.netflix_android;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Objects;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class RegisterActivity extends AppCompatActivity {
    private TextInputLayout emailLayout, phoneLayout, usernameLayout, fullnameLayout, passwordLayout, passwordRepeatLayout;
    private TextInputEditText emailInput, phoneInput, usernameInput, fullnameInput, passwordInput, passwordRepeatInput;
    private Button signupButton, uploadPictureButton;
    private TextView errorBanner, signinLink;
    private ImageView netflixLogo;
    private Uri selectedImageUri;

    private ImageView profilePicturePreview;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_register);

        initializeViews();
        setupClickListeners();
        checkForUsername();
    }

    private final ActivityResultLauncher<Intent> pickImage = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                    selectedImageUri = result.getData().getData();
                    profilePicturePreview.setImageURI(selectedImageUri);
                    profilePicturePreview.setVisibility(View.VISIBLE);
                    uploadPictureButton.setText("Change Profile Picture");
                }
            }
    );


    private void initializeViews() {
        // Initialize TextInputLayouts
        emailLayout = findViewById(R.id.email_layout);
        phoneLayout = findViewById(R.id.phone_layout);
        usernameLayout = findViewById(R.id.username_layout);
        fullnameLayout = findViewById(R.id.fullname_layout);
        passwordLayout = findViewById(R.id.password_layout);
        passwordRepeatLayout = findViewById(R.id.password_repeat_layout);

        // Initialize EditTexts
        emailInput = findViewById(R.id.email_input);
        phoneInput = findViewById(R.id.phone_input);
        usernameInput = findViewById(R.id.username_input);
        fullnameInput = findViewById(R.id.fullname_input);
        passwordInput = findViewById(R.id.password_input);
        passwordRepeatInput = findViewById(R.id.password_repeat_input);

        // Initialize Buttons and TextViews
        signupButton = findViewById(R.id.signup_button);
        uploadPictureButton = findViewById(R.id.upload_picture_button);
        errorBanner = findViewById(R.id.error_banner);
        signinLink = findViewById(R.id.signin_link);
        profilePicturePreview = findViewById(R.id.profile_picture_preview);

    }

    private void setupClickListeners() {
        signupButton.setOnClickListener(v -> validateAndSubmit());

        uploadPictureButton.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            pickImage.launch(intent);
        });


        signinLink.setOnClickListener(v -> {
            // Navigate to login activity
            Intent intent = new Intent(RegisterActivity.this, LoginActivity.class);
            startActivity(intent);
            finish();
        });


    }

    private void validateAndSubmit() {
        boolean isValid = true;
        clearErrors();

        // Validate email
        String email = Objects.requireNonNull(emailInput.getText()).toString().trim();
        if (!isValidEmail(email)) {
            emailLayout.setError("Please enter a valid email");
            isValid = false;
        }

        // Validate phone
        String phone = Objects.requireNonNull(phoneInput.getText()).toString().trim();
        if (!isValidPhone(phone)) {
            phoneLayout.setError("Please enter a valid phone number");
            isValid = false;
        }

        // Validate username
        String username = Objects.requireNonNull(usernameInput.getText()).toString().trim();
        if (!isValidUsername(username)) {
            usernameLayout.setError("Username must be between 4 and 20 characters");
            isValid = false;
        }

        // Validate fullname
        String fullname = Objects.requireNonNull(fullnameInput.getText()).toString().trim();
        if (TextUtils.isEmpty(fullname)) {
            fullnameLayout.setError("Full name is required");
            isValid = false;
        }

        // Validate password
        String password = Objects.requireNonNull(passwordInput.getText()).toString();
        if (!isValidPassword(password)) {
            passwordLayout.setError("Password must be between 4 and 60 characters");
            isValid = false;
        }

        String repeatedPassword = Objects.requireNonNull(passwordRepeatInput.getText()).toString();
        if (!repeatedPassword.equals(password)) {
            passwordLayout.setError("Repeated Password does not match password, please repeat the same password");
            isValid = false;
        }

        if (isValid) {
            // Create JSON object with form data
            JSONObject formData = new JSONObject();
            try {
                formData.put("email", email);
                formData.put("phoneNumber", phone);
                formData.put("userName", username);
                formData.put("fullName", fullname);
                formData.put("passWord", password);
            } catch (JSONException e) {
                e.printStackTrace();
                return;
            }

            // Proceed with registration
            registerUser(formData);
        }
    }
    public void registerUser(JSONObject formData) {
        OkHttpClient client = new OkHttpClient();
        String url = "http://10.0.0.2:4000/api/users/"; // Adjust for your backend

        RequestBody body = RequestBody.create(formData.toString(), MediaType.get("application/json; charset=utf-8"));

        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
                runOnUiThread(() ->
                        Toast.makeText(RegisterActivity.this, "Registration failed. Please try again.", Toast.LENGTH_LONG).show()
                );
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    runOnUiThread(() -> {
                        Toast.makeText(RegisterActivity.this, "User created successfully! You can now sign in.", Toast.LENGTH_LONG).show();
                        Intent intent = new Intent(RegisterActivity.this, LoginActivity.class);
                        startActivity(intent);
                        finish();
                    });
                } else {
                    String responseData = response.body().string();
                    try {
                        JSONObject jsonResponse = new JSONObject(responseData);
                        String errorMessage = jsonResponse.has("error") ? jsonResponse.getString("error") :
                                jsonResponse.has("message") ? jsonResponse.getString("message") :
                                        "An unexpected error occurred.";

                        runOnUiThread(() ->
                                Toast.makeText(RegisterActivity.this, errorMessage, Toast.LENGTH_LONG).show()
                        );
                    } catch (JSONException e) {
                        e.printStackTrace();
                        runOnUiThread(() ->
                                Toast.makeText(RegisterActivity.this, "An unexpected error occurred. Please try again later.", Toast.LENGTH_LONG).show()
                        );
                    }
                }
            }
        });
    }

    private void clearErrors() {
        emailLayout.setError(null);
        phoneLayout.setError(null);
        usernameLayout.setError(null);
        fullnameLayout.setError(null);
        passwordLayout.setError(null);
        errorBanner.setVisibility(View.GONE);
    }
    private void checkForUsername() {
        String username = getIntent().getStringExtra("userName");
        if (!TextUtils.isEmpty(username)) {
            usernameInput.setText(username);
        }
    }
    private boolean isValidEmail(String email) {
        return !TextUtils.isEmpty(email) && Patterns.EMAIL_ADDRESS.matcher(email).matches();
    }

    private boolean isValidPhone(String phone) {
        return !TextUtils.isEmpty(phone) && phone.matches("\\d+");
    }

    private boolean isValidUsername(String username) {
        return username.length() >= 4 && username.length() <= 20;
    }

    private boolean isValidPassword(String password) {
        return password.length() >= 4 && password.length() <= 60;
    }

    private void showError(String message) {
        errorBanner.setText(message);
        errorBanner.setVisibility(View.VISIBLE);
    }

}