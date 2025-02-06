package com.example.netflix_android;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.netflix_android.model.MovieEntity;
import com.squareup.picasso.Picasso;
import java.util.List;



    public class MovieAdapter extends RecyclerView.Adapter<MovieAdapter.MovieViewHolder> {
        private List<MovieEntity> movies;
        private Context context;


        public MovieAdapter(Context context, List<MovieEntity> movies) {
            this.context = context;
            this.movies = movies;
        }


        @NonNull
        @Override
        public MovieViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_movie, parent, false);
            return new MovieViewHolder(view);
        }

        // connect data with the view
        @Override
        public void onBindViewHolder(@NonNull MovieViewHolder holder, int position) {
            MovieEntity movie = movies.get(position);
            holder.movieTitle.setText(movie.getName());

            // -load poster Picasso
            Picasso.get().load(movie.getPoster()).into(holder.moviePoster);
        }

        // number of movies in list
        @Override
        public int getItemCount() {
            return movies.size();
        }

        //viewholder
        public static class MovieViewHolder extends RecyclerView.ViewHolder {
            ImageView moviePoster;
            TextView movieTitle;

            public MovieViewHolder(View itemView) {
                super(itemView);
                moviePoster = itemView.findViewById(R.id.moviePosterImageView);
                movieTitle = itemView.findViewById(R.id.movieTitleTextView);
            }
        }
    }

}
