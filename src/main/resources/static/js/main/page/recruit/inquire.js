$(function () {
    const Content = {
        params: {},
        load: function (params) {
            this.params = params;

            this.event();
        },
        event: function () {
            document.getElementById("btnEmployeeInfo").addEventListener("click", function() {
                window.location.href = '/recruit/employee_info';
            });
            document.getElementById("btnInfo").addEventListener("click", function() {
                window.location.href = '/recruit/info';
            });
            document.getElementById("btnNotice").addEventListener("click", function() {
                window.location.href = '/recruit/notice';
            });
            document.getElementById("btnApply").addEventListener("click", function() {
                window.location.href = '/recruit/apply';
            });
            document.getElementById("btnInquire").addEventListener("click", function() {
                window.location.href = '/recruit/inquire';
            });
            // 현재 메뉴 버튼 활성화
            document.querySelectorAll('button').forEach(function(button) {
                button.classList.remove('activation');
                if(button.id == "btnInquire") button.classList.add('activation');
            });

            Table.load("#table");

            const card = $('.submit-btn');
            card.find('*[role="action"]').click(function(e){
                const action = this.dataset.action;

                if(action === 'add'){
                    window.location.href = '/recruit/inquire/add'
                }
            })
        }
    }

    const Table = {
        table: null,
        load: function (target) {
            const that = this;
            const content = { kr: "채용문의가 없습니다.", eng: "There are no inquiries about recruitment.", jp: "採用のお問い合わせはありません。" };
            const title = { kr: "제목", eng: "Title", jp: "タイトル" };
            const writer = { kr: "작성자", eng: "Writer", jp: "作成者" };
            const view = { kr: "조회수", eng: "Views", jp: "閲覧数" };
            const status = { kr: "상태", eng: "Status", jp: "状態" };
            const creationDate = { kr: "작성일", eng: "Creation date", jp: "作成日" };
            const language = document.getElementById('language').value;
            const table = new Tabulator(target, {
                locale: 'ko-kr',
                langs: {
                    "ko-kr":{
                        pagination:{
                            "first":"<<",
                            "first_title":"",
                            "last":">>",
                            "last_title":"",
                            "prev":"<",
                            "prev_title":"",
                            "next":">",
                            "next_title":"",
                        }
                    }
                },
                minHeight: 500,
                layout: 'fitColumns',
                placeholder: `<div>
                                <div class="mt-5 mb-5">${content[language]}</div>
                              </div>`,
                pagination: true,
                paginationSize: 5,
                paginationSizeSelector:null,
                paginationInitialPage:1,
                paginationButtonCount:10,
                ajaxLoaderLoading: TableUtil.getLoaderLoading(),
                ajaxURL: Content.params.url,
                ajaxConfig: ajaxConfig,
                dataReceiveParams: {
                    "last_page": "lastPage",
                    "data": "items"
                },
                ajaxResponse: function (url, params, response) {
                    if (AjaxUtil.errorHandling(response)) {
                        return [];
                    }
                    response = response.result;
                    return response.items;
                },
                ajaxError: TableUtil.ajaxError,
                columnHeaderVertAlign: "middle",
                columns: [
                    {
                        title: "NO",
                        formatter: "rownum",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        width: 70,
                        download: false,
                        headerSort: false
                    },
                    {
                        title: title[language],
                        field: "inquiryTitle",
                        tooltip: true,
                        headerTooltip: true,
                        headerSort: false,
                        hozAlign: "center",
                        headerHozAlign: "center",
                    },
                    {
                        title: writer[language],
                        field: "inquiryName",
                        tooltip: true,
                        headerTooltip: true,
                        headerSort: false,
                        hozAlign: "center",
                        headerHozAlign: "center",
                    },
                    {
                        title: view[language],
                        field: "hit",
                        tooltip: true,
                        headerTooltip: true,
                        headerSort: false,
                        hozAlign: "center",
                        headerHozAlign: "center",
                    },
                    {
                        title: status[language],
                        field: "answerYn",
                        tooltip: true,
                        headerTooltip: true,
                        headerSort: false,
                        hozAlign: "center",
                        headerHozAlign: "center",
                    },
                    {
                        title: creationDate[language],
                        field: "createDate",
                        tooltip: true,
                        headerTooltip: true,
                        headerSort: false,
                        hozAlign: "center",
                        headerHozAlign: "center",
                    },
                ],
            });

            const events = {
                rowClick: function (e, row) {

                    AjaxUtil.request({
                        method: 'GET',
                        url: '/api/inquiry/findSelfPwd/' + row.getData().recKey,
                        async: false,
                        success: function (data) {
                            Swal.fire({
                                title: '비밀번호 확인',
                                html: `채용문의에서 작성한 비밀번호를 입력해주세요`,
                                icon: 'info',
                                input: 'password',
                                inputAttributes: {
                                    autocapitalize: 'off',
                                    autocomplete: 'new-password'
                                },
                                customClass: {
                                    confirmButton: `btn btn-info`,
                                    cancelButton: `btn btn-secondary`
                                },
                                showCancelButton: true,
                                confirmButtonText: '확인',
                                cancelButtonText: '취소',
                                showLoaderOnConfirm: true,
                                preConfirm: (pwd) => {
                                    if (pwd === data.result.items[0].inquiryPwd) {
                                        window.location.href = '/recruit/inquire/detail/' + row.getData().recKey;
                                    } else {
                                        Swal.showValidationMessage('비밀번호가 일치하지 않습니다!');
                                    }
                                },
                            })
                        }
                    });
                },
                ajaxError: TableUtil.ajaxError,
            }

            Object.entries(events).forEach(([event, callback]) => {
                table.on(event, callback);
            });

            this.table = table;
            return table;
        }
    }

    Content.load({
        url: "/api/inquiry/find"
    });
});