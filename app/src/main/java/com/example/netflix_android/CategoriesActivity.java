package com.example.netflix_android;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Switch;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.drawerlayout.widget.DrawerLayout;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.navigation.NavigationView;
import android.widget.RelativeLayout;

public class CategoriesActivity extends AppCompatActivity {

    private DrawerLayout drawerLayout;
    private FloatingActionButton fab;
    private NavigationView navView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_categories);

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



        Switch switchToggle = findViewById(R.id.switch_toggle);
        RelativeLayout layout = findViewById(R.id.layout);

        // Get the shared preferences to retrieve the saved switch state
        SharedPreferences preferences = getSharedPreferences("MyPrefs", MODE_PRIVATE);
        boolean switchState = preferences.getBoolean("switch_state", false);  // Default to false (unchecked)
        switchToggle.setChecked(switchState);

        // Set initial background color and Switch color based on the switch state
        updateBackgroundAndSwitchColor(switchToggle, layout, switchState);

        // Listen for switch state changes and update the background and switch color
        switchToggle.setOnCheckedChangeListener((buttonView, isChecked) -> {
            // Save the switch state
            SharedPreferences.Editor editor = preferences.edit();
            editor.putBoolean("switch_state", isChecked);
            editor.apply();

            // Update background and Switch colors
            updateBackgroundAndSwitchColor(switchToggle, layout, isChecked);
        });



        // Set the username dynamically in the navigation drawer header
        setUsernameInNavHeader(username);

        navView.setNavigationItemSelectedListener(item -> {
            int id = item.getItemId();

            if (id == R.id.nav_logout) {
                // Navigate to HomePageActivity and close this activity
                Intent intent = new Intent(CategoriesActivity.this, HomePageActivity.class);
                startActivity(intent);
                finish(); // Close the current activity
                return true;
            } else if (id == R.id.nav_manager) { // Navigate to ManagerActivity with data
                Intent intent = new Intent(CategoriesActivity.this, ManagerActivity.class);
                intent.putExtra("USERNAME", username);
                intent.putExtra("jwt", getIntent().getStringExtra("jwt")); // Get JWT from Intent
                startActivity(intent);
                return true;
            } else if (id == R.id.nav_home) { // Navigate to ManagerActivity with data
                Intent intent = new Intent(CategoriesActivity.this, AfterLoginActivity.class);
                intent.putExtra("USERNAME", username);
                intent.putExtra("jwt", getIntent().getStringExtra("jwt")); // Get JWT from Intent
                startActivity(intent);
                return true;
            } else if (id == R.id.nav_categories) { // Navigate to ManagerActivity with data
                Intent intent = new Intent(CategoriesActivity.this, CategoriesActivity.class);
                intent.putExtra("USERNAME", username);
                intent.putExtra("jwt", getIntent().getStringExtra("jwt")); // Get JWT from Intent
                startActivity(intent);
                return true;
            }
            return false;
        });
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