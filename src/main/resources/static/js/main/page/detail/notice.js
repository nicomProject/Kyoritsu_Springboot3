$(function () {
    const Content = {
        params: {},
        load: function (params) {
            this.params = params;
            console.log(this.params)
            this.event();
        },
        event: function () {
            const paramValue = this.params.key
            const writer = { kr: "작성자", eng: "Writer", jp: "作成者" };
            const creationDate = { kr: "작성일", eng: "Creation date", jp: "作成日" };
            const language = document.getElementById('language').value;

            $(".notice-subtitle .writer").text(writer[language]);
            $(".notice-subtitle .creation_date").text(creationDate[language]);

            if(paramValue !== ""){
                AjaxUtil.requestBody({
                    url: '/api/notice/detail/' + paramValue,
                    data: {
                        key: paramValue,
                    },
                    success: function (data) {
                        console.log(data)
                        $(".notice-container #title").text(data.result.info.title);
                        $(".notice-container #create-user").text(data.result.info.createUser);
                        $(".notice-container #create-date").text(data.result.info.createDate);
                        $(".notice-container #content").html(data.result.info.content);

                        if (data.code != 200) {
                            Swal.fire({
                                icon: 'error',
                                html: "공지사항 조회를 실패헸습니다.",
                            })
                        }
                    }
                })
            }
        }
    }


    Content.load({
        key: $('.param[name="key"]').val() || ''
    });
});