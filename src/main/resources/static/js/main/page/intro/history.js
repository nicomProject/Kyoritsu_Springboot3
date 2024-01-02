$(function () {
    const Content = {
        load: function () {
            this.draw();
        },
        draw: function () {
            const container = $('#history-section');
            const editorContent = container.find('.editor-content');

            let contentObj = [];

            AjaxUtil.request({
                url: '/api/introductions/find',
                async: false,
                success: function (data){
                    contentObj = data.result.items;
                }
            })

            if(contentObj != null){
                contentObj.forEach(item => {
                    const contentId = item.recKey;
                    const contentData = item.content;

                    const historyContentId = $('#history_contentId').val();

                    if(contentId == historyContentId){
                        editorContent.html(contentData)
                    }
                })
            }

            this.event();
        },
        event: function () {
            var list_d = '.list-d';
            var list_d_pc = '.pc_view .list-d';
            var list_d_sp = '.sp_view .list-d';
            $(function () {
                $(list_d_pc).next().hide();
                $(list_d_sp).next().hide();
                $(list_d).on('click', function () {
                    $(list_d).next().slideToggle(200);
                    $(list_d).toggleClass('close', 200);
                });
                $('.pc_view ' + list_d).on('click', function () {
                    $("html,body").animate({scrollTop:$('.pc_view .history-list-title.list-d').offset().top - 150});
                })
                $('.sp_view ' + list_d).on('click', function () {
                    $("html,body").animate({scrollTop:$('.sp_view .history-list-title.list-d').offset().top - 70});
                })
            });

            $(function () {
                $(window).scroll(function () {
                    $('.effect-fade').each(function () {
                        var elemPos = $(this).offset().top;
                        var scroll = $(window).scrollTop();
                        var windowHeight = $(window).height();
                        if (scroll > elemPos - windowHeight) {
                            $(this).addClass('effect-scroll');
                        }
                    });
                });
            });

            $(function () {
                scroll_effect();

                $(window).scroll(function () {
                    scroll_effect();
                });

                function scroll_effect() {
                    $('.effect-fade').each(function () {
                        var elemPos = $(this).offset().top;
                        var scroll = $(window).scrollTop();
                        var windowHeight = $(window).height();
                        if (scroll > elemPos - windowHeight) {
                            $(this).addClass('effect-scroll');
                        }
                    });
                }
            });

        }
    }

    Content.load();
});