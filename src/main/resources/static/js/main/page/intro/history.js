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

            var list_a = '.list-a';
            var list_a_pc = '.pc_view .list-a';
            var list_a_sp = '.sp_view .list-a';
            var list_b = '.list-b';
            var list_b_pc = '.pc_view .list-b';
            var list_b_sp = '.sp_view .list-b';
            var list_c = '.list-c';
            var list_c_pc = '.pc_view .list-c';
            var list_c_sp = '.sp_view .list-c';
            var list_d = '.list-d';
            var list_d_pc = '.pc_view .list-d';
            var list_d_sp = '.sp_view .list-d';
            $(function () {
                $(list_a_pc).next().hide();
                $(list_a_sp).next().hide();
                $(list_a).on('click', function () {
                    $(list_a).next().slideToggle(200);
                    $(list_a).toggleClass('close', 200);
                });
                $('.pc_view ' + list_a).on('click', function () {
                    $("html,body").animate({scrollTop:$('.pc_view .history-list-title.list-a').offset().top - 150});
                })
                $('.sp_view ' + list_a).on('click', function () {
                    $("html,body").animate({scrollTop:$('.sp_view .history-list-title.list-a').offset().top - 70});
                })
                $(list_b_pc).next().hide();
                $(list_b_sp).next().hide();
                $(list_b).on('click', function () {
                    $(list_b).next().slideToggle(200);
                    $(list_b).toggleClass('close', 200);
                });
                $('.pc_view ' + list_b).on('click', function () {
                    $("html,body").animate({scrollTop:$('.pc_view .history-list-title.list-b').offset().top - 150});
                })
                $('.sp_view ' + list_b).on('click', function () {
                    $("html,body").animate({scrollTop:$('.sp_view .history-list-title.list-b').offset().top - 70});
                })
                $(list_c_pc).next().hide();
                $(list_c_sp).next().hide();
                $(list_c).on('click', function () {
                    $(list_c).next().slideToggle(200);
                    $(list_c).toggleClass('close', 200);
                });
                $('.pc_view ' + list_c).on('click', function () {
                    $("html,body").animate({scrollTop:$('.pc_view .history-list-title.list-c').offset().top - 150});
                })
                $('.sp_view ' + list_c).on('click', function () {
                    $("html,body").animate({scrollTop:$('.sp_view .history-list-title.list-c').offset().top - 70});
                })
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
                /*
                  $('.sp_view .history-list-container .history-item .center').on('click', function () {
                    $(this).next().slideToggle(200);
                    $(this).parent().toggleClass('open', 200);
                  });
                  $('.sp_view .history-list-container .history-item .close').on('click', function () {
                    $(this).parent().slideToggle(200);
                    $(this).parent().parent().toggleClass('open', 200);
                  });
                */
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

            // window.onload = function () {
            //     scroll_effect();
            //
            //     $(window).scroll(function () {
            //         scroll_effect();
            //     });
            //
            //     function scroll_effect() {
            //         $('.effect-fade').each(function () {
            //             var elemPos = $(this).offset().top;
            //             var scroll = $(window).scrollTop();
            //             var windowHeight = $(window).height();
            //             if (scroll > elemPos - windowHeight) {
            //                 $(this).addClass('effect-scroll');
            //             }
            //         });
            //     }
            // };

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