$(function () {
    const Content = {
        categorys: [],
        subCategorys: [],
        params: {},
        formData: {},
        categorys: [],
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
                    categorys = data.result.items
                }
            });

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
                        console.log(data.result.items[0]);
                        var support = ""
                        for (var key in categorys) {
                            if (categorys[key].recKey.toString() == data.result.items[0].jobId.support) {
                                support = categorys[key].categoryName
                            }
                        }

                        $("#name").text(data.result.items[0].name);
                        $("#gender").text(data.result.items[0].gender);
                        $("#phone").text(data.result.items[0].phone);
                        $("#email").text(data.result.items[0].email);
                        $("#birth").text(data.result.items[0].birthDate);
                        $("#nationality").text(data.result.items[0].nationality);
                        $("#contents_question").text(data.result.items[0].contents);
                        $("#form_tag").val(data.result.items[0].formTag);
                        $("#pass_yn").val(data.result.items[0].passYn);
                        $("#contents_answer").text(data.result.items[0].contentAnswer);
                        console.log(data.result.items[0].profilePath.substring(1));
                        // var profilePath = data.result.items[0].profilePath; // 변수에 담아 전달해야 절대경로로 동작함
                        // $("#profile").attr("src", profilePath);
                        $("#profile").attr("src", data.result.items[0].profilePath.substring(1));
                        $("#supportDetail").append($('<option>', {
                            value: data.result.items[0].jobId.support,
                            text: support
                        }))
                        $("#experienceDetail").append($('<option>', {
                            value: data.result.items[0].jobId.experience,
                            text: data.result.items[0].jobId.experience
                        }))

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