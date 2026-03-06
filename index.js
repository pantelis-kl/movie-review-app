class MovieReview{
    constructor(){
        this.apiKey=config.apiKey;
        this.navbarItems=document.querySelectorAll(".navbar-item");
        this.searchField=document.getElementById("search-input");
        this.searchButton=document.getElementById("search-button");
        this.errorMessage=document.getElementById("error-message");
        this.loadingMessage=document.querySelector(".full-loading");
        this.movieTitle=document.getElementById("movie-name");
        this.moviesContainer=document.querySelector(".movies-container");
        this.movieImage=document.getElementById("movie-image");
        this.movieDescr=document.getElementById("movie-description");
        this.releaseDate=document.getElementById("release-date");
        this.runtime=document.getElementById("runtime");
        this.producerName=document.getElementById("producer-name");
        this.totalReviews=document.getElementById("total-reviews");
        this.rating=document.getElementById("rating");
        this.init();
    }

    init(){
        this.initializeEventListeners();
    }

    initializeEventListeners(){
        let selectedIndex;
        this.navbarItems.forEach((item,index)=>{
            item.addEventListener("click",()=>{
                selectedIndex=index;
                this.customizeNavbarItems(index);
            });

            //hover navbar items
            item.addEventListener("mouseover",()=>{
                if(selectedIndex!==index)
                    this.setActiveNavbarItem(item);
            });
            item.addEventListener("mouseout",()=>{
                if(selectedIndex!==index)
                    this.deactivateNavabarItem(item);
            });
        });

        this.searchButton.addEventListener("click",()=>{
            this.fetchData();
        });

        this.searchField.addEventListener("keyup",event=>{
            if(event.key===`Enter`)
                this.fetchData();
        });

        document.querySelector(".movies-form").addEventListener("submit",event=>{
            event.preventDefault();
        })
    }

    async fetchData(){
        try{
            this.loadingMessage.style.display="flex";
            const movieName=document.getElementById("search-input").value.toLowerCase();
            if(movieName.trim()!==""){
                const response= await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${movieName}`);
                if(!response.ok){
                    this.getErrorMessage("Please enter a valid movie name");
                    throw new Error("Cannot fetch the resource");
                }
                const movieData= await response.json();
                try{
                    const movieId=this.getMovieId(movieData);
                    const movieDetailsData=await this.fetchMovieDetailsData(movieId);
                    const movieCreditsData=await this.fetchCreditsData(movieId);
                    const movieReviewsData=await this.fetchReviewsData(movieId);
                    console.log(movieReviewsData);
                    console.log(movieData);
                    this.callFunctions(movieData,movieDetailsData,movieCreditsData,movieReviewsData);
                }catch(error){
                    console.error("Cannot find the movie ID");
                    this.loadingMessage.style.display="none";
                    this.getErrorMessage("Please enter a valid movie name");
                }
            }else{
                this.getErrorMessage("Please enter a movie name");
                this.loadingMessage.style.display="none";
            }
        }catch(error){
            console.error(error);
        }
    }

    async fetchMovieDetailsData(movieId){
        try{
            const response=await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.apiKey}`);
            if(!response.ok)
                throw new Error("Cannot fetch the resource");
            return await response.json();
        }catch(error){
            console.error(error);
            this.getErrorMessage("Please enter a valid movie name");
        }
    }

    async fetchCreditsData(movieId){
        try{
            const response=await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${this.apiKey}`);
            if(!response.ok)
                throw new Error("Cannot fetch the resource");
            return await response.json();
        }catch(error){
            console.error(error);
            this.getErrorMessage("Please enter a valid movie name");
        }
    }

    async fetchReviewsData(movieId){
        try{
            const response=await fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${this.apiKey}`);
            if(!response.ok)
                throw new Error("Cannot fetch the resource");
            return await response.json();
        }catch(error){
            console.error(error);
            this.getErrorMessage("Please enter a valid movie name");
        }
    }

    callFunctions(movieData,movieDetailsData,movieCreditsData,movieReviewsData){
        try{
            if(movieData.results.length===0)
                throw new Error("cannot fetch the resource");
            this.loadingMessage.style.display="none";
            this.errorMessage.style.display="none";
            this.moviesContainer.style.display="flex";
            this.getMovieTitle(movieData);
            this.getMovieImage(movieData);
            this.getMovieDescription(movieData);
            this.getMovieDetails(movieDetailsData,movieCreditsData);
            this.getVoteStats(movieData);
        }catch(error){
            console.error(error);
            this.getErrorMessage("Please enter a valid movie name");
            this.loadingMessage.style.display="none";
        }
    }

    getMovieTitle(movieData){
        this.movieTitle.textContent=movieData.results[0].title;
    }

    getMovieImage(movieData){
        const imageUrl=`https://image.tmdb.org/t/p/w500${movieData.results[0].poster_path}`;
        this.movieImage.src=imageUrl;
        this.movieImage.alt="Movie Image";
    }

    getMovieDescription(movieData){
        this.movieDescr.textContent=movieData.results[0].overview;
    }

    getMovieDetails(movieDetailsData,movieCreditsData){
        this.releaseDate.textContent=`Release Date : ${movieDetailsData.release_date}`;
        this.runtime.textContent=`Runtime : ${movieDetailsData.runtime} mins`;
        this.producerName.textContent=`Producer : ${this.findDirector(movieCreditsData)}`;  
    }

    findDirector(movieCreditsData){
        let directorName;

        movieCreditsData.crew.forEach(movie=>{
            if(movie.job==="Director"){
                directorName= movie.original_name;
            }
        });
        if(directorName===undefined)
            directorName=movieCreditsData.crew[0].original_name;
        return directorName;
    }

    getVoteStats(movieData){
        this.totalReviews.innerHTML=`Total Reviews : ${movieData.results[0].vote_count} <i class="fa-solid fa-users"></i>`;
        this.rating.textContent=`Rating : ${(movieData.results[0].vote_average).toFixed(1)} ${this.getMovieStars(movieData)}`;
    }

    getMovieStars(movieData){
        const ratingNumber=movieData.results[0].vote_average;
        if(ratingNumber>=1 && ratingNumber<3)
            return "⭐";
        else if(ratingNumber>=3 && ratingNumber<5)
            return "⭐⭐";
        else if(ratingNumber>=5 && ratingNumber<7)
            return "⭐⭐⭐";
        else if(ratingNumber>=7 && ratingNumber<9)
            return "⭐⭐⭐⭐";
        else
            return "⭐⭐⭐⭐⭐";
    }

    getMovieId(movieData){
        return movieData.results[0].id;
    }

    getErrorMessage(message){
        this.errorMessage.style.display="block";
        this.errorMessage.textContent=message;
    }

    customizeNavbarItems(index){
        this.navbarItems.forEach((item,currentIndex)=>{
            if(index===currentIndex)
                this.setActiveNavbarItem(item);
            else
                this.deactivateNavabarItem(item);
        });
    }

    setActiveNavbarItem(item){
        item.style.color="rgb(168, 168, 168)";
        item.style.textDecoration="underline";
    }

    deactivateNavabarItem(item){
        item.style.color="white";
        item.style.textDecoration="none";
    }
}

new MovieReview();