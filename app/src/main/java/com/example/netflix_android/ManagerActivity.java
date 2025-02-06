package com.example.netflix_android;

import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.Switch;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.drawerlayout.widget.DrawerLayout;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.navigation.NavigationView;

import com.example.netflix_android.R;


import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;


import androidx.activity.result.ActivityResult;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.netflix_android.viewmodel.MovieViewModel;
import com.example.netflix_android.viewmodel.CategoryViewModel;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.navigation.NavigationView;
import androidx.drawerlayout.widget.DrawerLayout;

import java.util.Arrays;
import java.util.List;

public class ManagerActivity extends AppCompatActivity {

    private DrawerLayout drawerLayout;
    private FloatingActionButton fab;
    private NavigationView navView;
    private Button btnMovies, btnCategories;
    private Button btnCreateMovie, btnDeleteMovie, btnCreateCategory, btnDeleteCategory;

    private Button btnSubmitCreateMovie, btnSubmitDeleteMovie, btnSubmitCreateCategory, btnSubmitDeleteCategory;
    private Button btnSelectVideo, btnSelectPoster;
    private LinearLayout layoutMovies, layoutCategories;
    private LinearLayout formCreateMovie, formDeleteMovie, formCreateCategory, formDeleteCategory;
    private EditText etMovieName, etMovieCategoryId, etMovieDescription, etMovieId;
    private EditText etCategoryName, etCategoryId;
    private Uri videoUri, posterUri;
    private TextView tvVideoFileName;
    private ImageView ivPoster;

    private MovieViewModel movieViewModel;
    private CategoryViewModel categoryViewModel;

    private static final int VIDEO_REQUEST_CODE = 101;
    private static final int POSTER_REQUEST_CODE = 102;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_manager);

        movieViewModel = new ViewModelProvider(this).get(MovieViewModel.class);
        categoryViewModel = new ViewModelProvider(this).get(CategoryViewModel.class);

        // Retrieve the username from the Intent
        String username = getIntent().getStringExtra("USERNAME");

        // Initialize views
        drawerLayout = findViewById(R.id.drawerLayout);
        fab = findViewById(R.id.fab);
        navView = findViewById(R.id.navView);

        // Set click listener for the FAB
        fab.setOnClickListener(view -> {
            if (drawerLayout.isDrawerOpen(navView)) {
                drawerLayout.closeDrawer(navView);
            } else {
                drawerLayout.openDrawer(navView);
            }
        });


        // Reference to the Switch and layout
       // Switch switchToggle = findViewById(R.id.switch_toggle);
       // RelativeLayout layout = findViewById(R.id.layout);

        SharedPreferences preferences = getSharedPreferences("MyPrefs", MODE_PRIVATE);
        boolean switchState = preferences.getBoolean("switch_state", false);
   //     switchToggle.setChecked(switchState);

        // Set initial background color and Switch color based on the switch state
     //   updateBackgroundAndSwitchColor(switchToggle, layout, switchState);

        // Listen for switch state changes and update the background and switch color
     //   switchToggle.setOnCheckedChangeListener((buttonView, isChecked) -> {
            // Save the switch state
            SharedPreferences.Editor editor = preferences.edit();
          //  editor.putBoolean("switch_state", isChecked);
            editor.apply();

            // Update background and Switch colors
          //  updateBackgroundAndSwitchColor(switchToggle, layout, isChecked);
     //   });


        // Set the username dynamically in the navigation drawer header
        setUsernameInNavHeader(username);

        navView.setNavigationItemSelectedListener(item -> {
            int id = item.getItemId();

            if (id == R.id.nav_logout) {
                // Navigate to HomePageActivity and close this activity
                Intent intent = new Intent(ManagerActivity.this, HomePageActivity.class);
                startActivity(intent);
                finish(); // Close the current activity
                return true;
            } else if (id == R.id.nav_manager) { // Navigate to ManagerActivity with data
                Intent intent = new Intent(ManagerActivity.this, ManagerActivity.class);
                intent.putExtra("USERNAME", username);
                intent.putExtra("jwt", getIntent().getStringExtra("jwt")); // Get JWT from Intent
                startActivity(intent);
                return true;
            } else if (id == R.id.nav_home) { // Navigate to ManagerActivity with data
                Intent intent = new Intent(ManagerActivity.this, AfterLoginActivity.class);
                intent.putExtra("USERNAME", username);
                intent.putExtra("jwt", getIntent().getStringExtra("jwt")); // Get JWT from Intent
                startActivity(intent);
                return true;
            } else if (id == R.id.nav_categories) { // Navigate to ManagerActivity with data
                Intent intent = new Intent(ManagerActivity.this, CategoriesActivity.class);
                intent.putExtra("USERNAME", username);
                intent.putExtra("jwt", getIntent().getStringExtra("jwt")); // Get JWT from Intent
                startActivity(intent);
                return true;
            }
            return false;
        });
        initializeUI();
        setupButtonListeners();
    }

    private void initializeUI() {
        drawerLayout = findViewById(R.id.drawerLayout);
        fab = findViewById(R.id.fab);
        navView = findViewById(R.id.navView);

        btnMovies = findViewById(R.id.btnMovies);
        btnCategories = findViewById(R.id.btnCategories);
        layoutMovies = findViewById(R.id.layoutMovies);
        layoutCategories = findViewById(R.id.layoutCategories);

        btnCreateMovie = findViewById(R.id.btnCreateMovie);
        btnDeleteMovie = findViewById(R.id.btnDeleteMovie);
        btnCreateCategory = findViewById(R.id.btnCreateCategory);
        btnDeleteCategory = findViewById(R.id.btnDeleteCategory);

        btnSelectVideo = findViewById(R.id.btnSelectVideo);
        btnSelectPoster = findViewById(R.id.btnSelectPoster);
        btnSubmitCreateMovie = findViewById(R.id.btnSubmitCreateMovie);
        btnSubmitDeleteMovie = findViewById(R.id.btnSubmitDeleteMovie);
        btnSubmitCreateCategory = findViewById(R.id.btnSubmitCreateCategory);
        btnSubmitDeleteCategory = findViewById(R.id.btnSubmitDeleteCategory);

        formCreateMovie = findViewById(R.id.formCreateMovie);
        formDeleteMovie = findViewById(R.id.formDeleteMovie);
        formCreateCategory = findViewById(R.id.formCreateCategory);
        formDeleteCategory = findViewById(R.id.formDeleteCategory);

        etMovieName = findViewById(R.id.etMovieName);
        etMovieCategoryId = findViewById(R.id.etMovieCategoryId);
        etMovieDescription = findViewById(R.id.etMovieDescription);
        etMovieId = findViewById(R.id.etMovieId);

        etCategoryName = findViewById(R.id.etCategoryName);
        etCategoryId = findViewById(R.id.etCategoryId);

        tvVideoFileName = findViewById(R.id.tvVideoFileName);
        ivPoster = findViewById(R.id.ivPoster);
    }

    private void setupButtonListeners() {
        btnMovies.setOnClickListener(v -> {
            layoutMovies.setVisibility(View.VISIBLE);
            layoutCategories.setVisibility(View.GONE);

            btnCreateMovie.setVisibility(View.VISIBLE);
            btnDeleteMovie.setVisibility(View.VISIBLE);
        });

        btnCategories.setOnClickListener(v -> {
            layoutMovies.setVisibility(View.GONE);
            layoutCategories.setVisibility(View.VISIBLE);

            btnCreateCategory.setVisibility(View.VISIBLE);
            btnDeleteCategory.setVisibility(View.VISIBLE);
        });

        // Create Movie Listener
        btnCreateMovie.setOnClickListener(v -> {
            formCreateMovie.setVisibility(View.VISIBLE);
            formDeleteMovie.setVisibility(View.GONE);
        });

        // Delete Movie Listener
        btnDeleteMovie.setOnClickListener(v -> {
            formCreateMovie.setVisibility(View.GONE);
            formDeleteMovie.setVisibility(View.VISIBLE);
        });

        // Create Category Listener
        btnCreateCategory.setOnClickListener(v -> {
            formCreateCategory.setVisibility(View.VISIBLE);
            formDeleteCategory.setVisibility(View.GONE);
        });

        // Delete Category Listener
        btnDeleteCategory.setOnClickListener(v -> {
            formCreateCategory.setVisibility(View.GONE);
            formDeleteCategory.setVisibility(View.VISIBLE);
        });

        btnSelectVideo.setOnClickListener(v -> selectMedia(VIDEO_REQUEST_CODE, "video/*"));
        btnSelectPoster.setOnClickListener(v -> selectMedia(POSTER_REQUEST_CODE, "image/*"));

        //submit listeners
        btnSubmitCreateMovie.setOnClickListener(v -> createMovie());
        btnSubmitDeleteMovie.setOnClickListener(v -> deleteMovie());
        btnSubmitCreateCategory.setOnClickListener(v -> createCategory());
        btnSubmitDeleteCategory.setOnClickListener(v -> deleteCategory());
    }
    public void createMovie() {
        Log.d("MovieCreation", "Create movie button clicked!");
        Toast.makeText(this, "Creating movie...", Toast.LENGTH_SHORT).show();
        String name = etMovieName.getText().toString();
        List<String> categories = Arrays.asList(etMovieCategoryId.getText().toString().split(","));
        String description = etMovieDescription.getText().toString();

        if (videoUri == null || posterUri == null) {
            Toast.makeText(this, "Please select both video and poster", Toast.LENGTH_SHORT).show();
            return;
        }

        // Call ViewModel method to create a movie
        movieViewModel.createMovie(this, name, categories, description, videoUri, posterUri);

    }

    public void deleteMovie() {
        String movieId = etMovieId.getText().toString();
        movieViewModel.deleteMovie(movieId);
    }

    public void createCategory() {
        Log.d("categoryCreation", "Create category button clicked!");
        String categoryName = etCategoryName.getText().toString();
        categoryViewModel.createCategory(categoryName, true);
    }

    public void deleteCategory() {
        String categoryId = etCategoryId.getText().toString();
        categoryViewModel.deleteCategory(categoryId);
    }

    private void selectMedia(int requestCode, String type) {
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        intent.setType(type);
        startActivityForResult(intent, requestCode);
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK && data != null) {
            Uri selectedUri = data.getData();

            if (requestCode == VIDEO_REQUEST_CODE) {
                videoUri = selectedUri;
                String videoFileName = getFileName(selectedUri);

                tvVideoFileName.setText(videoFileName);
            } else if (requestCode == POSTER_REQUEST_CODE) {
                posterUri = selectedUri;

                ivPoster.setImageURI(selectedUri);
            }
        }
    }

    private String getFileName(Uri uri) {
        String fileName = null;
        if (uri.getScheme().equals("content")) {
            Cursor cursor = getContentResolver().query(uri, null, null, null, null);
            if (cursor != null && cursor.moveToFirst()) {
                int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                fileName = cursor.getString(nameIndex);
                cursor.close();
            }
        }
        return fileName;
    }

    private void setUsernameInNavHeader(String username) {
        // Access the header view
        View headerView = navView.getHeaderView(0);

        // Find the TextView for the username
        TextView headerUsername = headerView.findViewById(R.id.headerUsername);

        // Set the username
        headerUsername.setText(username);
    }

    private void updateBackgroundAndSwitchColor(Switch switchToggle, RelativeLayout layout, boolean isChecked) {
        if (isChecked) {
            layout.setBackgroundColor(getResources().getColor(android.R.color.black));  // Dark mode (black)
            switchToggle.setThumbTintList(getResources().getColorStateList(android.R.color.holo_red_dark));  // Red color for checked state
            switchToggle.setTrackTintList(getResources().getColorStateList(android.R.color.holo_red_dark));  // Red color for checked state
        } else {
            layout.setBackgroundColor(getResources().getColor(android.R.color.white));  // Light mode (white)
            switchToggle.setThumbTintList(getResources().getColorStateList(android.R.color.black));  // Black color for unchecked state
            switchToggle.setTrackTintList(getResources().getColorStateList(android.R.color.black));  // Black color for unchecked state
        }
    }
}