$(function () {
    const Content = {
        categorys: [],
        subCategorys: [],
        params: {},
        formData: {},
        load: function (params) {
            this.params = params;

            let items = [];
            const category = $("#categoryDetail");
            let categoryValue = "";

            AjaxUtil.request({
                url: '/api/category/find',
                async: false,
                success: function (data) {
                    items = data.result.items;
                }
            });

            items.forEach(item => {
                category.append($('<option>', {
                        value: item.recKey,
                        text: item.categoryName,
                    }
                ));
            })

            category.on("change", function(){
                categoryValue = $("#categoryDetail option:selected").val()
                console.log(categoryValue)
            })
            this.event();
        },

        event: function () {
            const paramValue = this.params.key
                AjaxUtil.requestBody({
                    url: '/api/applicant/findSelf/' + paramValue,
                    success: function (data) {
                        console.log(data)
                        $("#name").text(data.result.items[0].name);
                        $("#gneder").text(data.result.items[0].gender);
                        $("#phone").text(data.result.items[0].phone);
                        $("#email").text(data.result.items[0].email);
                        $("#birth").text(data.result.items[0].birthDate);
                        $("#nationality").text(data.result.items[0].nationality);
                        $("#contents_question").text(data.result.items[0].contents);
                        $("#form_tag").val(data.result.items[0].formTag);
                        $("#pass_yn").val(data.result.items[0].passYn);
                        $("#contents_answer").text(data.result.items[0].contentAnswer);


                        if (data.code == 200) {
                        } else {
                            Swal.fire({
                                icon: 'error',
                                html: "지원자 조회가 실패하였습니다.",
                            })
                        }
                    }
                })

            const buttons = document.querySelectorAll("button");

            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    const action = button.getAttribute("data-action");
                    if (action === "add") {
                        var passYn = $("#pass_yn").val();
                        var formTag = $("#form_tag").val();
                        var contentsAnswer = $("#contents_answer").val();

                            AjaxUtil.requestBody({
                                url: '/api/applicant/add',
                                data: {
                                    passYn: passYn,
                                    formTag: formTag,
                                    contentsAnswer: contentsAnswer,
                                    key: paramValue,
                                },
                                success: function (data) {
                                    if (data.code == 200)
                                    {
                                        Alert.success({text: '결과등록이 완료되었습니다.'}, function(){
                                            location.href = '/admin/applicants'
                                        })
                                    } else if(data.code === 210){
                                        Alert.warning({text: data.desc})
                                    }
                                    else{
                                        Alert.error({text: data.desc});
                                    }
                                }
                            })
                        }
                    else if(action === "list"){
                        location.href = '/admin/applicants'
                    }
                });
            });
        }
    };
    Content.load({
        key: $('.param[name="key"]').val() || ''
    });
})