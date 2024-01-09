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
            var fileListHash = [];
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
                    var experience = ""
                    if(data.result.items[0].jobId.experience == 'career') experience = "경력직";
                    if(data.result.items[0].jobId.experience == 'newcomer') experience = "계약직";

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
                    $("#profile").attr("src", data.result.items[0].profilePath.substring(1));
                    $("#btn-download").attr("href", data.result.items[0].profilePath.substring(1));
                    $("#supportDetail").append($('<option>', {
                        value: data.result.items[0].jobId.support,
                        text: support
                    }))
                    $("#experienceDetail").append($('<option>', {
                        value: data.result.items[0].jobId.experience,
                        text: experience
                    }))
                    // 첨부파일 리스트 href & fileName 가져오기
                    fileListHash = data.result.items[0].filesPath.map(filePath => {
                        const filePath_ = filePath.substring(1);
                        const fileName = filePath.substring(filePath.lastIndexOf('/')+1);
                        return {'href' : filePath_, 'fileName' : fileName}
                    });

                    // 첨부파일 리스트 확인
                    console.log(fileListHash);

                    // 첨부파일 리스트 제작
                    const fileList = document.getElementById("attachFileList");
                    console.log(fileListHash);
                    if(fileListHash.length > 0){
                        fileList.innerHTML = '';
                        fileListHash.forEach(file => {
                            const listItem = document.createElement('li');
                            const link = document.createElement('a');
                            link.href = file.href;
                            link.download = file.fileName;
                            link.textContent = file.fileName;

                            listItem.appendChild(link);
                            fileList.appendChild(listItem);
                        });
                    }

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