$(function(){
    const Content = {
        load: function(){
            $('.close-btn').on('click', function (){
                window.close();
            })
        }
    };

    Content.load();
})