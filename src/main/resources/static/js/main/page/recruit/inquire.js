$(function () {
    const Content = {
        params: {},
        load: function (params) {
            this.params = params;

            this.event();
        },
        event: function () {
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
            const table = new Tabulator(target, {
                locale: 'ko-kr',
                langs: TableUtil.setDefaults(),
                layout: 'fitColumns',
                placeholder: `<div>
                                <div class="mt-3">채용문의가 없습니다.</div>
                              </div>`,
                pagination: false,
                paginationSize: paginationConfig.size,
                paginationSizeSelector: paginationConfig.selector,
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
                        title: '제목',
                        field: "inquiryTitle",
                        tooltip: true,
                        headerTooltip: true,
                        headerSort: false,
                        hozAlign: "center",
                        headerHozAlign: "center",
                    },
                    {
                        title: '작성자',
                        field: "inquiryName",
                        tooltip: true,
                        headerTooltip: true,
                        headerSort: false,
                        hozAlign: "center",
                        headerHozAlign: "center",
                    },
                    {
                        title: '조회수',
                        field: "hit",
                        tooltip: true,
                        headerTooltip: true,
                        headerSort: false,
                        hozAlign: "center",
                        headerHozAlign: "center",
                    },
                    {
                        title: '상태',
                        field: "answerYn",
                        tooltip: true,
                        headerTooltip: true,
                        headerSort: false,
                        hozAlign: "center",
                        headerHozAlign: "center",
                    },
                    {
                        title: '작성일',
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