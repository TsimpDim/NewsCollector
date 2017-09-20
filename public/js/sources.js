$('document').ready(function(){
    selected_sources = [];

    $('.src_btn').each(function(){
        $(this).click(function(){
            let index = $.inArray($.trim($(this).text()),selected_sources);//index = position of source name in array

            if($(this).css('color') == 'rgb(255, 255, 255)'){//If it hasn't been clicked before
                $(this).css('color','#FFE3AA');
                if(index == -1){//And the source is not already in the list
                        selected_sources.push($.trim($(this).text()));
                }
            }else{
                $(this).css('color','rgb(255, 255, 255)');
                selected_sources.splice(index,1);//remove from array
            }
            
            console.log(selected_sources);

            $("#viewArt").val(selected_sources.join(','));//Transform the array into a delimited string and pass it to the submit button form
        });
    });
});