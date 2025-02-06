package com.example.netflix_android.database;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;

import com.example.netflix_android.model.CategoryEntity;
import com.example.netflix_android.model.MovieEntity;

@Database(entities = {MovieEntity.class, CategoryEntity.class}, version = 1)
@TypeConverters({Converter.class})
public abstract class AppDatabase extends RoomDatabase {
    public abstract MovieDao movieDao();
    public abstract CategoryDao categoryDao();

    private static AppDatabase INSTANCE;

    public static AppDatabase getDatabase(Context context) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
                                    AppDatabase.class, "database")
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}
