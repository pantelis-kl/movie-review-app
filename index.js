class MovieReview{
    constructor(){
        this.navbarItems=document.querySelectorAll(".navbar-item");
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