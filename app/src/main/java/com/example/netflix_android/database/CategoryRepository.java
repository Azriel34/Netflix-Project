package com.example.netflix_android.database;

import android.app.Application;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.netflix_android.model.CategoryEntity;
import com.example.netflix_android.network.ApiService;
import com.example.netflix_android.network.RetrofitInstance;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CategoryRepository {
        private final CategoryDao categoryDao;
        private final LiveData<List<CategoryEntity>> allMovies;
        private final ExecutorService executorService;
        private final ApiService apiService;

        public CategoryRepository(Application application) {
            AppDatabase db = AppDatabase.getDatabase(application);
            categoryDao = db.categoryDao();
            allMovies = categoryDao.getAllCategories();
            executorService = Executors.newSingleThreadExecutor();
            apiService = RetrofitInstance.getRetrofitInstance().create(ApiService.class);
        }

        public LiveData<List<CategoryEntity>> getAllCategories() {
            return allMovies;
        }

        public LiveData<CategoryEntity> getCategoryByIdFromLocal(String id) {
            return categoryDao.getCategoryById(id);
        }

        public LiveData<CategoryEntity> getCategoryByIdFromServer(String id) {
            MutableLiveData<CategoryEntity> categoryLiveData = new MutableLiveData<>();
            apiService.getCategory(id).enqueue(new Callback<CategoryEntity>() {
                @Override
                public void onResponse(Call<CategoryEntity> call, Response<CategoryEntity> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        categoryLiveData.postValue(response.body());
                    }
                }

                @Override
                public void onFailure(Call<CategoryEntity> call, Throwable t) {
                    categoryLiveData.postValue(null);
                }
            });
            return categoryLiveData;
        }

        public void insert(CategoryEntity movie) {
            executorService.execute(() -> categoryDao.insertCategory(movie));
        }


        public void fetchAndSaveMovieIfNotExist(String id, MutableLiveData<CategoryEntity> movieLiveData) {
            //check whether movie exsist in the room
            getCategoryByIdFromLocal(id).observeForever(localMovie -> {
                if (localMovie != null) {
                    //if movie exsist in the room-update the live data
                    movieLiveData.postValue(localMovie);
                } else {
                    //else-bring the data from the api
                    getCategoryByIdFromServer(id).observeForever(remoteCategory -> {
                        if (remoteCategory != null) {
                            //create local room entity accroding to the api entity data
                            CategoryEntity CategoryEntity = new CategoryEntity(
                                    remoteCategory.getId(),
                                    remoteCategory.getName(),
                                    remoteCategory.getPromoted()
                            );

                            //after creation-add it to the room
                            insert(CategoryEntity);

                            //update the livedata
                            movieLiveData.postValue(CategoryEntity);
                        }
                    });
                }
            });
        }

        //create category
        public void createCategory(String categoryName, String promoted, MutableLiveData<Boolean> operationSuccess) {
            RequestBody nameBody = RequestBody.create(MediaType.parse("text/plain"), categoryName);
            RequestBody promotedBody = RequestBody.create(MediaType.parse("text/plain"), promoted);

            apiService.createCategory(nameBody, promotedBody).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    operationSuccess.postValue(response.isSuccessful());
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    operationSuccess.postValue(false);
                }
            });
        }

        //delete category
        public void deleteCategory(String categoryId, MutableLiveData<Boolean> operationSuccess) {
            apiService.deleteCategory(categoryId).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    operationSuccess.postValue(response.isSuccessful());
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    operationSuccess.postValue(false);
                }
            });
        }



    }

