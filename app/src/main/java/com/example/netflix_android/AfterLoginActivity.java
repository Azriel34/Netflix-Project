package com.example.netflix_android;

import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.drawerlayout.widget.DrawerLayout;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.navigation.NavigationView;

public class AfterLoginActivity extends AppCompatActivity {

    private DrawerLayout drawerLayout;
    private FloatingActionButton fab;
    private NavigationView navView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_after_login);

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

        // Set the username dynamically in the navigation drawer header
        setUsernameInNavHeader(username);
    }

    private void setUsernameInNavHeader(String username) {
        // Access the header view
        View headerView = navView.getHeaderView(0);

        // Find the TextView for the username
        TextView headerUsername = headerView.findViewById(R.id.headerUsername);

        // Set the username
        headerUsername.setText(username);
    }
}