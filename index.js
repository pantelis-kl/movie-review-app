class MovieReview{
    constructor(){
        this.apiKey=config.apiKey;
        this.navbarItems=document.querySelectorAll(".navbar-item");
        this.topRatedLink=document.getElementById("top-rated-link");
        this.searchField=document.getElementById("search-input");
        this.searchButton=document.getElementById("search-button");
        this.errorMessage=document.getElementById("error-message");
        this.searchMoviesHeader=document.getElementById(".search-movies-header");
        this.movieData;
        this.movieCreditsData;
        this.movieDetailsData;
        this.movieReviewsData;
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
        this.reviewItem=document.querySelectorAll(".review-item");
        this.authorsName=document.querySelectorAll(".authors-name");
        this.authorsImage=document.querySelectorAll(".authors-image");
        this.authorsRating=document.querySelectorAll(".authors-rating");
        this.commentContent=document.querySelectorAll(".comment-content");
        this.createdAt=document.querySelectorAll(".created-at");
        this.reviewAuthorsHeader=document.getElementById("review-authors-header");
        this.pageFooter=document.querySelector("footer");
        this.releatedItems=document.querySelectorAll(".releated-item");
        this.releatedItemsTitle=document.querySelectorAll(".releated-movie-title");
        this.topRatedItems=document.querySelectorAll(".top-rated-item")
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
            this.fetchData(this.searchField.value);
        });

        this.searchField.addEventListener("keyup",event=>{
            if(event.key===`Enter`){
                this.fetchData(this.searchField.value);
            }
        });

        document.querySelector(".movies-form").addEventListener("submit",event=>{
            event.preventDefault();
        });

        this.topRatedLink.addEventListener("click",()=>{
            this.hideMoviesContainer();
            this.fetchDataForTopRated();
        });

        document.getElementById("search-movie-link").addEventListener("click",()=>{
            this.displayMoviesContainer();
        });
    }

    async fetchData(movieName){
        try{
            this.loadingMessage.style.display="flex";
            if(movieName.trim()!==""){
                const response= await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${movieName}`);
                if(!response.ok){
                    this.getErrorMessage("Please enter a valid movie name");
                    throw new Error("Cannot fetch the resource");
                }
                this.movieData= await response.json();
                try{
                    console.log(this.movieData.results[0].title);
                    const movieId=this.getMovieId(this.movieData,0);
                    this.callFunctions(movieId);
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
            throw error;
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
            throw error;
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
            throw error;
        }
    }

    async fetchDataForTopRated(){
        try{
            const response=await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${this.apiKey}`);
            if(!response.ok)
                throw new Error("No movies was founded");
            const topRatedData=await response.json();
            this.createTopRatedItems(topRatedData);
        }catch(error){
            console.error(error);
            this.getErrorMessage("No movies was founded");
        }
    }

    async getAllData(movieId){
        this.movieDetailsData=await this.fetchMovieDetailsData(movieId);
        this.movieCreditsData=await this.fetchCreditsData(movieId);
        this.movieReviewsData=await this.fetchReviewsData(movieId);
    }

    async callFunctions(movieId){
        try{
            if(this.movieData.results.length===0)
                throw new Error("cannot fetch the resource");
            await this.getAllData(movieId);
            this.loadingMessage.style.display="none";
            this.errorMessage.style.display="none";
            this.moviesContainer.style.display="flex";
            this.pageFooter.style.display="flex";
            this.getMovieTitle(this.movieTitle,this.movieDetailsData);
            this.getMovieImage(this.movieImage,this.movieDetailsData);
            this.getMovieDescription(this.movieDescr,this.movieDetailsData);
            this.getMovieDetails();
            this.getVoteStats(this.totalReviews,this.rating,this.movieDetailsData);
            this.createReviewsDiv();
            this.createReleatedMovies();
        }catch(error){
            console.error(error);
            this.getErrorMessage("Please enter a valid movie name");
            this.loadingMessage.style.display="none";
        }
    }

    getMovieTitle(movieTitle,movieDetailsData){
       movieTitle.textContent=movieDetailsData.title;
    }

    getMovieImage(movieImage,movieDetailsData){
        const imageUrl=`https://image.tmdb.org/t/p/w500${movieDetailsData.poster_path}`;
        movieImage.src=imageUrl;
        movieImage.alt="Movie Image";
    }

    getMovieDescription(movieDescr,movieDetailsData){
        movieDescr.textContent=movieDetailsData.overview
    }

    getMovieDetails(){
        this.releaseDate.textContent=`Release Date : ${this.movieDetailsData.release_date}`;
        this.runtime.textContent=`Runtime : ${this.movieDetailsData.runtime} mins`;
        this.producerName.textContent=`Producer : ${this.findDirector(this.movieCreditsData)}`;  
    }

    findDirector(movieCreditsData){
        let directorName;

        movieCreditsData.crew.forEach(movie=>{
            if(movie.job==="Director"){
                directorName= movie.original_name;
            }
        });
        try{
        if(directorName===undefined)
            directorName=movieCreditsData.crew[0].original_name;
        return directorName;
        }catch(error){
            console.error("Cannot find the name");
        }
    }

    getVoteStats(totalReviews,rating,movieDetailsData){
        totalReviews.innerHTML=`Total Reviews : ${movieDetailsData.vote_count} <i class="fa-solid fa-users"></i>`;
        const ratingNumber=movieDetailsData.vote_average;
        rating.textContent=`Rating : ${(movieDetailsData.vote_average).toFixed(1)} ${this.getMovieStars(ratingNumber)}`;
    }

    getMovieStars(ratingNumber){
        if(ratingNumber>=1 && ratingNumber<3)
            return "⭐";
        else if(ratingNumber>=3 && ratingNumber<5)
            return "⭐⭐";
        else if(ratingNumber>=5 && ratingNumber<7)
            return "⭐⭐⭐";
        else if(ratingNumber>=7 && ratingNumber<9)
            return "⭐⭐⭐⭐";
        else if(ratingNumber>=9)
            return "⭐⭐⭐⭐⭐";
        else 
            return "";
    }

    createReviewsDiv(){
        const arrayLength=this.movieReviewsData.results.length;
        this.hideReviewsDiv(arrayLength);
        this.displayAuthorsHeader(arrayLength);
        for(let i=0;i<arrayLength;i++){
            if(i>5)
                break;
            this.reviewItem[i].style.display="flex";
            this.getAuthorsRating(i);
            this.getAuthorsImageAndName(i)
            this.getCommentContent(i);
            this.getCreationTime(i);
        }
    }

    getAuthorsImageAndName(index){
        const avatarPath=this.movieReviewsData.results[index].author_details.avatar_path;
        if(avatarPath!== null){
            const imageUrl=`https://image.tmdb.org/t/p/w500${avatarPath}`;
            this.authorsImage[index].style.display="inline";
            this.authorsImage[index].src=imageUrl
            this.authorsName[index].innerHTML=`User ${this.authorsImage[index].innerHTML} : ${this.movieReviewsData.results[index].author}`;
        }else{
            this.authorsImage[index].style.display="none";
            this.authorsName[index].innerHTML=`<i class="fa-solid fa-user"></i> User: ${this.movieReviewsData.results[index].author}`;
        }

    }

    displayAuthorsHeader(arrayLength){
        if(arrayLength===0)
            this.reviewAuthorsHeader.textContent="This movie has no comments yet";
        else if(arrayLength===1)
            this.reviewAuthorsHeader.textContent="1 user commented";
        else if(arrayLength<6)
            this.reviewAuthorsHeader.textContent=`${arrayLength} users commented`;
        else
            this.reviewAuthorsHeader.textContent="6 users commented";
    }

    getAuthorsRating(index){
        const ratingNumber=this.movieReviewsData.results[index].author_details.rating;
        this.authorsRating[index].innerHTML=`Rating : ${this.movieReviewsData.results[index].author_details.rating} 
        ${this.getMovieStars(ratingNumber)}`;    
    }

    getCommentContent(index){
        this.commentContent[index].innerHTML=`<i class="fa-solid fa-quote-left"></i> ${this.movieReviewsData.results[index].content}
        <i class="fa-solid fa-quote-right"></i>`;
    }

    getCreationTime(index){
        let timeText=[...this.movieReviewsData.results[index].created_at];
        let fullTime="";
        for(let i=0;i<10;i++){
            fullTime+=timeText[i]
        }
        this.createdAt[index].textContent=fullTime;
    }

    hideReviewsDiv(arrayLength){
        for(let i=arrayLength;i<6;i++){
            if(i>5)
                break;
            this.reviewItem[i].style.display="none";
        }
    }

    getMovieId(movieData,index){
        return movieData.results[index].id;
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


    createReleatedMovies(){
        const arrayLength=this.movieData.results.length;
        this.clearReleatedMovies();
        for(let i=1;i<arrayLength;i++){
            const newDiv=document.createElement("div");
            newDiv.classList="releated-item";
            document.querySelector(".releated-movies-container").append(newDiv);
            this.releatedItems=document.querySelectorAll(".releated-item");
            this.createReleatedImage(newDiv,this.movieData,i);
            this.createReleatedH3(newDiv,this.movieData,i);
            this.createReleatedRating(newDiv,this.movieData,i);
        }
        this.initializeReleatedItemsEventListener();    
    }

    initializeReleatedItemsEventListener(){
        this.releatedItems.forEach((item,index)=>{
            item.addEventListener("click",()=>{
                const movieId=this.getMovieId(this.movieData,index+1);
                this.callFunctions(movieId);
                document.getElementById("search-movie").scrollIntoView({behavior:'smooth'});
            });
        });
    }

    createReleatedImage(newDiv,movieData,index){
        const newImg=document.createElement("img");
        newImg.src=`https://image.tmdb.org/t/p/w500${movieData.results[index].poster_path}`;
        newDiv.append(newImg);
    }

    createReleatedH3(newDiv,movieData,index){
        const newH3=document.createElement("h3");
        newH3.textContent=movieData.results[index].title;
        newH3.classList="releated-movie-title";
        this.releatedItemsTitle=document.querySelectorAll(".releated-movie-title");
        newDiv.append(newH3);
    }

    createReleatedRating(newDiv,movieData,index){
        const newH3=document.createElement("h3");
        newH3.textContent=`Rating : ${movieData.results[index].vote_average.toFixed(1)}
         ${this.getMovieStars(movieData.results[index].vote_average.toFixed(1))}`;
        newDiv.append(newH3);
    }

    clearReleatedMovies(){
        this.releatedItems.forEach(item=>{
            item.remove();
        });
    }

    createTopRatedItems(topRatedData){
        this.removeTopRatedItems();
        const self=this;
        topRatedData.results.forEach(async (movie,index)=>{
            const newDiv=document.createElement("div");
            newDiv.classList="top-rated-item";
            document.querySelector(".top-rated-container").append(newDiv);
            this.topRatedItems=document.querySelectorAll(".top-rated-item");
            const movieId=self.getMovieId(topRatedData,index);
            await self.getAllData(movieId);
            this.createTopRatedItemsTitle(movie,newDiv);
            this.createTopRatedDiv(newDiv,movie);
            this.createDivForReviews(newDiv,movie);
            this.createDivForDetails(newDiv,movie);
        });
        this.initializeTopRatedItemsEventListener(topRatedData);    
    }

    createTopRatedItemsTitle(topRatedData,newDiv){
        const newH1=document.createElement("h1");
        newH1.textContent=topRatedData.title;
        newDiv.append(newH1);
    }

    createTopRatedDiv(newDiv,topRatedData){
        const insideDiv=document.createElement("div");
        insideDiv.classList="image-text-container";
        newDiv.append(insideDiv);
        this.createTopRatedImage(insideDiv,topRatedData);
        this.createTopRatedDescr(insideDiv,topRatedData);
    }

    createTopRatedImage(newDiv,topRatedData){
        const newImg=document.createElement("img");
        newImg.src=`https://image.tmdb.org/t/p/w500${topRatedData.poster_path}`;
        newDiv.append(newImg);
    }

    createTopRatedDescr(newDiv,topRatedData){
        const newH3=document.createElement("h3");
        newH3.textContent=topRatedData.overview;
        newDiv.append(newH3);
    }

    createDivForReviews(newDiv,topRatedData){
        const insideDiv=document.createElement("div");
        insideDiv.classList="top-rated-reviews-container";
        newDiv.append(insideDiv);
        this.createReviewDetails(insideDiv,topRatedData);
    }

    createReviewDetails(newDiv,topRatedData){
        const totalH4=document.createElement("h3");
        const ratingH4=document.createElement("h3");
        totalH4.innerHTML=`Total Reviews : ${topRatedData.vote_count} <i class="fa-solid fa-users"></i>`;
        totalH4.id="total-reviews-top-rated";
        const ratingNumber=topRatedData.vote_average.toFixed(1);
        ratingH4.innerHTML=`Rating : ${topRatedData.vote_average.toFixed(1)} ${this.getMovieStars(ratingNumber)}`;
        ratingH4.id="top-rated-rating";
        newDiv.append(totalH4);
        newDiv.append(ratingH4);
    }

    createDivForDetails(newDiv,topRatedData){
        const insideDiv=document.createElement("div");
        insideDiv.classList="top-rated-details-container";
        newDiv.append(insideDiv);
        this.createH4ForDetails(insideDiv,topRatedData);
        this.createIconsForDetails(insideDiv,topRatedData);
    }

    createH4ForDetails(newDiv,topRatedData){
        const creationH4=document.createElement("h4");
        creationH4.textContent=`Release Date : ${topRatedData.release_date}`;
        newDiv.append(creationH4);
    }

    createIconsForDetails(newDiv,topRatedData){
        const totalWatchIcon=document.createElement("h4");
        const commentsIcon=document.createElement("h4");
        totalWatchIcon.innerHTML=`<i class="fa-solid fa-eye"></i> ${topRatedData.popularity}`;
        commentsIcon.innerHTML=`<i class="fa-solid fa-comment"></i> ${this.movieReviewsData.results.length}`;
        commentsIcon.id="top-rated-comments";
        commentsIcon.title="View Comments";
        newDiv.append(totalWatchIcon);
        newDiv.append(commentsIcon);
    }

    removeTopRatedItems(){
        this.topRatedItems.forEach(item=>{
            item.remove();
        });
    }

    initializeTopRatedItemsEventListener(topRatedData){
        const self=this;
        this.topRatedItems.forEach((movie,index)=>{
            movie.addEventListener("click",()=>{
                self.fetchData(topRatedData.results[index].title);
                self.displayMoviesContainer();
            });
        });
    }

    hideMoviesContainer(){
        this.moviesContainer.style.display="none";
        this.pageFooter.style.display="none";
        document.getElementById("search-movie").style.display="none";
        document.getElementById("top-rated").style.display="flex";
    }

    displayMoviesContainer(){
        document.getElementById("top-rated").style.display="none";
        document.getElementById("search-movie").style.display="flex";
    }
}

new MovieReview();