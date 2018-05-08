$('document').ready(function(){
    selected_sources = [];

    $('.src_btn').each(function(){
        $(this).click(function(){
            // index = position of source name in array
            let index = $.inArray($.trim($(this).text()),selected_sources);

            if($(this).css('color') == 'rgb(255, 255, 255)'){ // If it hasn't been clicked before
                $(this).css('color','#FFE3AA');
                if(index == -1){ // And the source is not already in the list
                    selected_sources.push($.trim($(this).text()));
                }
            }else{
                $(this).css('color','rgb(255, 255, 255)');
                selected_sources.splice(index,1); // Remove from array
            }
            
            // Transform the array into a delimited string and pass it to the submit button form
            $("#viewArt").val(selected_sources.join(','));
        });
    });
});