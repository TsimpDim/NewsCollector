let minifiedHeader = false;

$("document").ready(function(){

    $("#prim_head_link").on("click", function(){
        $('html, body').animate({scrollTop: 0}, 250);
        $("#header").css("font-size","4em");
        $("#header").css("opacity","1");
        minifiedHeader = false;
    });

    $(window).scroll(function() {
        if($(window).scrollTop() > 50) {
            minifiedHeader = true;
            $("#header").css("font-size","2em");
            $("#header").css("opacity","0.7");
        }else{
            minifiedHeader = false;
            $("#header").css("font-size","4em");
            $("#header").css("opacity","1");
        }
    });

    $("#header").hover(function(){
        if(minifiedHeader){
            $("#header").animate({opacity:1}, 250);
        }
    }, function(){
        if(minifiedHeader){
            $("#header").animate({opacity:0.7}, 250);
        }
    });
    
});