package com.example.netflix_android.viewmodel;

import android.app.Application;
import android.util.Log;

import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.netflix_android.database.CategoryRepository;
import com.example.netflix_android.database.MovieRepository;
import com.example.netflix_android.model.CategoryEntity;

import java.util.List;


public class CategoryViewModel extends AndroidViewModel {
    private final CategoryRepository  categoryRepository;
    private final LiveData<List<CategoryEntity>> allCategories;
    private final MutableLiveData<Boolean> operationSuccess = new MutableLiveData<>();


    public CategoryViewModel(Application application) {
        super(application);
        categoryRepository = new CategoryRepository(application);
        allCategories =  categoryRepository.getAllCategories();
    }

    //create category
    public void createCategory(String categoryName, boolean promoted) {
        Log.d("categoryCreation", "Create category viewmodel!");
        categoryRepository.createCategory(categoryName, promoted, operationSuccess);
    }

    //delete category
    public void deleteCategory(String categoryId) {
        categoryRepository.deleteCategory(categoryId, operationSuccess);
    }

    public LiveData<Boolean> getOperationSuccess() {
        return operationSuccess;
    }

    public LiveData<List<CategoryEntity>> getAllCategories() {
        return allCategories;
    }

    public LiveData<CategoryEntity> getCategoryById(String id) {
        MutableLiveData<CategoryEntity> CategoryLiveData = new MutableLiveData<>();

        //using the repository in order to get the movie
        categoryRepository.fetchAndSaveMovieIfNotExist(id, CategoryLiveData);

        return CategoryLiveData;
    }

    public void insert(CategoryEntity movie) {
        categoryRepository.insert(movie);
    }

}