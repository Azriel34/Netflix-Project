package com.example.netflix_android.pages;
import com.example.netflix_android.R;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.netflix_android.AfterLoginActivity;
import com.example.netflix_android.CategoriesActivity;
import com.example.netflix_android.HomePageActivity;
import com.example.netflix_android.network.ApiService;
import com.example.netflix_android.network.RetrofitInstance;
import com.example.netflix_android.model.MovieEntity;
import com.example.netflix_android.model.CategoryEntity;
import com.example.netflix_android.viewmodel.MovieViewModel;
import com.example.netflix_android.viewmodel.CategoryViewModel;
import okhttp3.MultipartBody;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import androidx.drawerlayout.widget.DrawerLayout;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.navigation.NavigationView;

import okhttp3.MediaType;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AdminActivity extends AppCompatActivity {
    private Button btnMovies, btnCategories;
    private Button btnCreateMovie, btnDeleteMovie, btnCreateCategory, btnDeleteCategory;
    private Button btnSelectVideo, btnSelectPoster;
    private LinearLayout layoutMovies, layoutCategories;
    private LinearLayout formCreateMovie, formDeleteMovie, formCreateCategory, formDeleteCategory;
    private EditText etMovieName, etMovieCategoryId, etMovieDescription, etMovieId;
    private EditText etCategoryName, etCategoryId;
    private Uri videoUri, posterUri;
    private MovieViewModel movieViewModel;
    private CategoryViewModel categoryViewModel;

    private static final int VIDEO_REQUEST_CODE = 101;
    private static final int POSTER_REQUEST_CODE = 102;

    private DrawerLayout drawerLayout;
    private FloatingActionButton fab;
    private NavigationView navView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_manager);

        movieViewModel = new ViewModelProvider(this).get(MovieViewModel.class);
        categoryViewModel = new ViewModelProvider(this).get(CategoryViewModel.class);

        String username = getIntent().getStringExtra("USERNAME");

        initializeUI();
        setupNavigationDrawer(username);
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
    }

    private void setupNavigationDrawer(String username) {
        fab.setOnClickListener(view -> {
            if (drawerLayout.isDrawerOpen(navView)) {
                drawerLayout.closeDrawer(navView);
            } else {
                drawerLayout.openDrawer(navView);
            }
        });
        setUsernameInNavHeader(username);
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
         //create movie listeners
        btnCreateMovie.setOnClickListener(v -> {
            formCreateMovie.setVisibility(View.VISIBLE);
            formDeleteMovie.setVisibility(View.GONE);
        });
        //delete movie listeners
        btnDeleteMovie.setOnClickListener(v -> {
            formCreateMovie.setVisibility(View.GONE);
            formDeleteMovie.setVisibility(View.VISIBLE);
        });
        ////create category listeners
        btnCreateCategory.setOnClickListener(v -> {
            formCreateCategory.setVisibility(View.VISIBLE);
            formDeleteCategory.setVisibility(View.GONE);
        });
        ////delete category listeners
        btnDeleteCategory.setOnClickListener(v -> {
            formCreateCategory.setVisibility(View.GONE);
            formDeleteCategory.setVisibility(View.VISIBLE);
        });

        btnSelectVideo.setOnClickListener(v -> selectMedia(VIDEO_REQUEST_CODE, "video/*"));
        btnSelectPoster.setOnClickListener(v -> selectMedia(POSTER_REQUEST_CODE, "image/*"));
    }

    private void createMovie() {
        String name = etMovieName.getText().toString();
        List<String> categories = Arrays.asList(etMovieCategoryId.getText().toString().split(","));
        String description = etMovieDescription.getText().toString();

        if (videoUri == null || posterUri == null) {
            Toast.makeText(this, "Please select both video and poster", Toast.LENGTH_SHORT).show();
            return;
        }
        movieViewModel.createMovie(this, name, categories, description, videoUri, posterUri);
    }

    private void deleteMovie() {
        String movieId = etMovieId.getText().toString();
        movieViewModel.deleteMovie(movieId);
    }

    private void createCategory() {
        String categoryName = etCategoryName.getText().toString();
        categoryViewModel.createCategory(categoryName, "true");
    }

    private void deleteCategory() {
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
            } else if (requestCode == POSTER_REQUEST_CODE) {
                posterUri = selectedUri;
            }
        }
    }

    private void setUsernameInNavHeader(String username) {
        View headerView = navView.getHeaderView(0);
        TextView headerUsername = headerView.findViewById(R.id.headerUsername);
        headerUsername.setText(username);
    }
}

