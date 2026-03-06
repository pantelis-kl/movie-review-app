class MovieReview{
    constructor(){
        this.navbarItems=document.querySelectorAll(".navbar-item");
        this.searchField=document.getElementById("search-input");
        this.searchButton=document.getElementById("search-button");
        this.errorMessage=document.getElementById("error-message");
        this.loadingMessage=document.querySelector(".full-loading");
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