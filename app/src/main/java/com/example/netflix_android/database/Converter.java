package com.example.netflix_android.database;
import androidx.room.TypeConverter;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;

    public class Converter {
        @TypeConverter
        public String fromList(List<String> categories) {
            Gson gson = new Gson();
            return gson.toJson(categories);
        }

        @TypeConverter
        public List<String> toList(String categoriesString) {
            Gson gson = new Gson();
            Type listType = new TypeToken<List<String>>() {}.getType();
            return gson.fromJson(categoriesString, listType);
        }
    }


